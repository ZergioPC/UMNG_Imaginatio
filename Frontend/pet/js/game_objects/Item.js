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
     * Can be partial data from localStorage (e.g., {id, x, y, isPlaced}) or full data for a new item.
     */
    constructor(itemData) {
        const staticData = ITEMS_DATA[itemData.id];
       
        if (!staticData) {
            throw new Error(`Item data for ID "${itemData.id}" not found in ITEMS_DATA.`);
        }

        // --- Static Properties (from ITEMS_DATA) ---
        this.id = itemData.id;
        this.name = staticData.name;
        this.price = staticData.price;
        this.width = staticData.width;
        this.height = staticData.height;
        this.type = staticData.type;

        // --- Dynamic Properties (from saved data or defaults) ---
        this.x = itemData.x || 0;
        this.y = itemData.y || 0;
        // isPlaced determines if a 'draggable' item should be rendered on the canvas.
        // Defaults to true for backward compatibility and for newly bought items.
        this.isPlaced = itemData.isPlaced !== undefined ? itemData.isPlaced : true;


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
        // An item that is not placed cannot be clicked.
        if (!this.isPlaced) return false;
        
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
