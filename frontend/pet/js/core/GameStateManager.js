/*
    What is GameStateManager.js?

    Think of the GameStateManager as the brain of your minigame. It doesn't draw anything on the screen, but it holds and manages all the important information (the "state").

    Its primary responsibilities are:
    1. Single Source of Truth: It keeps track of the player's "Likes" (currency) and the items they own. Any other part of your code that needs this information will ask the GameStateManager.
    2. Handling Logic: It contains the functions for core game actions, like buying an item or changing an item's position.
    3. Persistence: It tells the LocalStorageManager when to save or load the game data, so the player's progress isn't lost.

    By keeping this logic separate, the rest of your code (like the rendering and input handling) stays much cleaner.
*/

// GameStateManager.js

// These are dependencies we will create later.
// For now, we write the code assuming they exist.
import { LocalStorageManager } from './LocalStorageManager.js';
import { Inventory } from '../ui/Inventory.js';
import { Store } from '../ui/Store.js';
import { Item } from '../game_objects/Item.js';

// We will also create this constants file to hold item data.
import { ITEMS_DATA } from '../constants.js';

/**
 * Manages the overall state of the game, including player data,
 * inventory, and currency. It acts as the single source of truth.
 */
export class GameStateManager {
    constructor() {
        this.storage = new LocalStorageManager('Imaginatio_petData');
        
        // Attempt to load saved data from localStorage
        const savedData = this.storage.load();
        

        if (savedData) {
            // If data exists, initialize from it
            this.userLikes = savedData.userLikes !== undefined ? savedData.userLikes : 0;
            this.userInventory = new Inventory(savedData.userItems);
            this.activeBackgroundId = savedData.activeBackgroundId || 'background_base';
            this.activeFloorId = savedData.activeFloorId || 'floor_base';
            this.activeBowlId = savedData.activeBowlId || 'bowl_base';
        } else {           
            // Otherwise, start with default values for a new game
            this.userLikes = 0; 
            this.userInventory = new Inventory();
            this.activeBackgroundId = 'background_base';
            this.activeFloorId = 'floor_base';
            this.activeBowlId = 'bowl_base';
            
            // Automatically "purchase" the free base items for a new player
            this.userInventory.addItem(new Item({ id: 'house_base' }));
            this.userInventory.addItem(new Item({ id: 'background_base' }));
            this.userInventory.addItem(new Item({ id: 'floor_base' }));
            this.userInventory.addItem(new Item({ id: 'bowl_base' }));
            this.saveData();
            window.location.reload();
        }

        // The store's inventory is defined by our game's design, not player data.
        this.storeInventory = new Store(ITEMS_DATA); 
        
        console.log('GameStateManager initialized.');
    }

    /**
     * Saves the current game state to localStorage.
     */
    saveData() {
        const dataToSave = {
            userLikes: this.userLikes,
            userItems: this.userInventory.getItemsForSaving(),
            activeBackgroundId: this.activeBackgroundId,
            activeFloorId: this.activeFloorId,
            activeBowlId: this.activeBowlId,
        };
        this.storage.save(dataToSave);
        console.log('Game data saved.');
    }

    /**
     * Handles the logic for purchasing an item.
     * @param {string} itemId The ID of the item to purchase.
     * @returns {{success: boolean, reason?: string}} An object indicating if the purchase was successful and why.
     */
    purchaseItem(itemId) {
        const item = this.storeInventory.getItem(itemId);
        if (!item) {
            console.error(`Item with id ${itemId} not found in store.`);
            return { success: false, reason: 'ITEM_NOT_FOUND' };
        }

        if (this.userLikes < item.price) {
            console.log('Not enough likes to purchase.');
            return { success: false, reason: 'NOT_ENOUGH_LIKES' };
        }

        if (this.userInventory.hasItem(itemId)) {
            console.log('User already owns this item.');
            return { success: false, reason: 'ALREADY_OWNED' };
        }

        // All checks passed, proceed with the purchase
        this.userLikes -= item.price;
        this.userInventory.addItem(item);
        
        console.log(`Purchased ${item.name}. Remaining likes: ${this.userLikes}`);
        
        // If the purchased item is a background or floor or Bowl, set it as active
        if (item.type === 'background') {
            this.setActiveBackground(item.id);
        } else if (item.type === 'floor') {
            this.setActiveFloor(item.id);
        } else if (item.type === 'bowl') {
            this.setActiveBowl(item.id);
        }

        this.saveData();
        return { success: true };
    }

    /**
     * Adds a like to the user's total.
     */
    addLike() {
        this.userLikes++;
        this.saveData();
    }
    
    /**
     * Updates the position of an item in the user's inventory.
     * @param {string} itemId The ID of the item to move.
     * @param {number} x The new x-coordinate.
     * @param {number} y The new y-coordinate.
     */
    moveItem(itemId, x, y) {
        const item = this.userInventory.getItem(itemId);
        if (item && item.type === 'draggable') { // Ensure we only move draggable items
            item.x = x;
            item.y = y;
            this.saveData(); 
            console.log(`Moved ${item.name} to (${x}, ${y})`);
            return true;
        }
        console.error(`Could not move item ${itemId}. Not found or not draggable.`);
        return false;
    }

    /**
     * Toggles whether a draggable item is shown on the canvas.
     * @param {string} itemId The ID of the item to toggle.
     * @returns {boolean} True if the toggle was successful, false otherwise.
     */
    toggleItemPlacement(itemId) {
        const item = this.userInventory.getItem(itemId);
        if (item && item.type === 'draggable') {
            item.isPlaced = !item.isPlaced;
            //Reset posicion if it's not placed
            if(item.isPlaced){
                item.x = 10.0;
                item.y = 10.0;
            }
            this.saveData();
            console.log(`Set placement for ${item.name} to ${item.isPlaced}`);
            return true;
        }
        console.error(`Could not toggle placement for item ${itemId}. Not found or not draggable.`);
        return false;
    }

    /**
     * Sets the active background skin.
     * @param {string} itemId The ID of the background item to activate.
     */
    setActiveBackground(itemId) {
        const item = this.userInventory.getItem(itemId);
        if (item && item.type === 'background') {
            this.activeBackgroundId = itemId;
            this.saveData();
            console.log(`Active background set to: ${item.name}`);
            return true;
        }
        console.error(`Could not set background. Item ${itemId} not owned or not a background.`);
        return false;
    }

    /**
     * Sets the active floor skin.
     * @param {string} itemId The ID of the floor item to activate.
     */
    setActiveFloor(itemId) {
        const item = this.userInventory.getItem(itemId);
        if (item && item.type === 'floor') {
            this.activeFloorId = itemId;
            this.saveData();
            console.log(`Active floor set to: ${item.name}`);
            return true;
        }
        console.error(`Could not set floor. Item ${itemId} not owned or not a floor.`);
        return false;
    }

    /**
     * Sets the active bowl skin.
     * @param {string} itemId The ID of the bowl item to activate.
     */
    setActiveBowl(itemId) {
        const item = this.userInventory.getItem(itemId);
        if (item && item.type === 'bowl') {
            this.activeBowlId = itemId;
            this.saveData();
            console.log(`Active bowl set to: ${item.name}`);
            return true;
        }
        console.error(`Could not set bowl. Item ${itemId} not owned or not a bowl.`);
        return false;
    }

    // --- GETTERS ---

    getActiveBackground() {
        return this.userInventory.getItem(this.activeBackgroundId);
    }

    getActiveFloor() {
        return this.userInventory.getItem(this.activeFloorId);
    }

    getActiveBowl() {        
        return this.userInventory.getItem(this.activeBowlId);
    }
    
    getLikes() {
        return this.userLikes;
    }

    getUserInventory() {
        return this.userInventory;
    }

    getStoreInventory() {
        return this.storeInventory;
    }
}
