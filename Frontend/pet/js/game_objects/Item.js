// Item.js

// We will create this file later. For now, we assume it exists and
// contains the master data for all items.
import { ITEMS_DATA } from '../constants.js';

/**
 * Represents a single item in the game, either in the store or in the user's inventory.
 * It holds both static data (from ITEMS_DATA) and dynamic data (like position).
 */
export class Item {
    /**
     * @param {object} itemData - Data to construct the item.
     * @param {string} itemKey - Key for the item
     * Can be partial data from localStorage (e.g., {id, x, y}) or full data for a new item.
     */
    constructor(itemData) {
        const staticData = ITEMS_DATA[itemData.id];
       
        if (!staticData) {
            throw new Error(`Item data for ID "${itemData.id}" not found in ITEMS_DATA.`);
        }

        // --- Static Properties (from ITEMS_DATA) ---
        this.id = itemData.id; // The ID is now the string key, e.g., 'house_base'
        this.name = staticData.name;
        this.price = staticData.price;
        this.width = staticData.width;
        this.height = staticData.height;
        this.type = staticData.type;

        // --- Dynamic Properties (from saved data or defaults) ---
        // If x/y are provided (from localStorage), use them. Otherwise, default to 0.
        this.x = itemData.x || 0;
        this.y = itemData.y || 0;

        // --- Asset Loading ---
        this.sprite = new Image();
        this.sprite.src = staticData.src;
        this.isLoaded = false;
        this.sprite.onload = () => {
            this.isLoaded = true;
        };
        this.sprite.onerror = () => {
            console.error(`Failed to load sprite for ${this.name} at ${this.sprite.src}`);
        };
    }

    /**
     * Checks if a given coordinate pair is within the bounds of this item.
     * Assumes the item is a rectangle.
     * @param {number} x The x-coordinate of the click/touch.
     * @param {number} y The y-coordinate of the click/touch.
     * @returns {boolean} True if the coordinates are inside the item.
     */
    isClicked(x, y) {
        return (
            x >= this.x &&
            x <= this.x + this.width &&
            y >= this.y &&
            y <= this.y + this.height
        );
    }

    /**
     * Draws the item's sprite on the canvas if it has loaded.
     * @param {CanvasRenderingContext2D} ctx The canvas rendering context.
     */
    render(ctx) {
        if (this.isLoaded) {
            ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
        }
    }
}