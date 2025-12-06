
// LocalStorageManager.js

/**
 * A utility class to handle all interactions with the browser's localStorage.
 * This keeps the storage logic separate from the main game logic.
 */
export class LocalStorageManager {
    /**
     * @param {string} storageKey The key to use for storing data in localStorage.
     */
    constructor(storageKey) {
        this.storageKey = storageKey;
    }

    /**
     * Saves the provided data to localStorage.
     * The data is converted to a JSON string before saving.
     * @param {object} data The game state data to save.
     */
    save(data) {
        try {
            const jsonString = JSON.stringify(data);
            localStorage.setItem(this.storageKey, jsonString);
        } catch (error) {
            console.error("Could not save data to localStorage", error);
        }
    }

    /**
     * Loads data from localStorage.
     * The JSON string is parsed back into a JavaScript object.
     * @returns {object | null} The loaded data object, or null if no data is found or an error occurs.
     */
    load() {
        try {
            const jsonString = localStorage.getItem(this.storageKey);
            if (jsonString === null) {
                return null; // No saved data found
            }
            return JSON.parse(jsonString);
        } catch (error) {
            console.error("Could not load data from localStorage", error);
            return null;
        }
    }
}
