// Inventory.js

import { Item, BowlItem } from '../game_objects/Item.js';

/**
 * Manages the collection of items owned by the user. It's responsible
 * for adding, retrieving, and preparing items for storage.
 */
export class Inventory {
    /**
     * Initializes the inventory.
     * @param {Array<object>} [rawItemsData=[]] - An array of plain objects, typically from
     * localStorage, each representing an item's saved state (e.g., {id, x, y, isPlaced}).
     */
    constructor(rawItemsData = []) {
        /**
         * @type {Map<string, Item>}
         * @private
         */
        this.items = new Map();

        console.log(rawItemsData);
        
        if (rawItemsData && Array.isArray(rawItemsData)) {
            rawItemsData.forEach(itemData => {
                // The Item constructor now handles all properties, including 'isPlaced'
                if(itemData.id.includes("bowl")){
                    const bowl = new BowlItem(itemData)
                    this.items.set(bowl.id, bowl);
                }else{
                    const item = new Item(itemData);
                    this.items.set(item.id, item);
                }
            });
        }
        console.log('User inventory initialized with', this.items.size, 'items.');
    }

    /**
     * Adds a new Item object to the inventory.
     * @param {Item} item The full Item object to add.
     */
    addItem(item) {
        if (!item || !item.id) {
            console.error('Cannot add invalid item to inventory.', item);
            return;
        }
        this.items.set(item.id, item);
    }

    /**
     * Retrieves an item from the inventory by its ID.
     * @param {string} itemId The ID of the item to get.
     * @returns {Item | undefined}
     */
    getItem(itemId) {
        return this.items.get(itemId);
    }

    /**
     * Checks if an item exists in the inventory.
     * @param {string} itemId The ID of the item to check.
     * @returns {boolean}
     */
    hasItem(itemId) {
        return this.items.has(itemId);
    }

    /**
     * Returns all items in the inventory as an array.
     * @returns {Item[]}
     */
    getItems() {        
        return Array.from(this.items.values());
    }

    /**
     * Returns a simplified array of item data suitable for JSON serialization.
     * This includes all dynamic data that needs to be saved.
     * @returns {Array<{id: string, x: number, y: number, isPlaced: boolean}>}
     */
    getItemsForSaving() {
        return Array.from(this.items.values()).map(item => ({
            id: item.id,
            x: item.x,
            y: item.y,
            isPlaced: item.isPlaced, // Save the placement status
        }));
    }
}
