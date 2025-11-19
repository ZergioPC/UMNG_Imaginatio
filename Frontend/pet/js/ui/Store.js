// Store.js

import { Item, BowlItem } from '../game_objects/Item.js';

/**
 * Manages the collection of all items available for sale in the game.
 * This class acts as a data container for the store's master inventory.
 * It does not handle UI rendering itself; it simply holds the data that
 * a UI component would need to render the store.
 */
export class Store {
    /**
     * Initializes the store's inventory from the master item data.
     * @param {object} [itemsData={}] - The raw item data, typically from constants.js (ITEMS_DATA).
     */
    constructor(itemsData = {}) {
        /**
         * @type {Map<string, Item>}
         * @private
         */
        this.items = new Map();

        for (const key in itemsData) {
            // Create a new item by passing its key (which is now its ID)
            if(key.includes("bowl")){
                const item = new BowlItem({ id: key });
                this.items.set(key, item);
            }else{
                const item = new Item({ id: key });
                this.items.set(key, item);
            }
        }        
        console.log('Store inventory initialized with', this.items.size, 'items.');
        console.log(this.items);
        
    }

    /**
     * Retrieves an item from the store by its ID.
     * @param {string} itemId The ID of the item to get.
     * @returns {Item | undefined}
     */
    getItem(itemId) {
        return this.items.get(itemId);
    }

    /**
     * Returns all items available in the store as an array.
     * This is useful for UI components that need to render the store.
     * @returns {Item[]}
     */
    getAllItems() {
        return Array.from(this.items.values());
    }
}
