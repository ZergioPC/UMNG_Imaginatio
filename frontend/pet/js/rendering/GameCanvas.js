/*
    What is GameCanvas.js?

    This file defines the GameCanvas class, which acts as the renderer for the game.
    Its sole responsibility is to draw the current state of the game onto the
    HTML <canvas> element.

    It pulls data from the GameStateManager (like which items to draw and where)
    and calls the `render` method of each game object. It ensures that everything
    is drawn in the correct order, from back to front.
*/

import { Pet } from '../game_objects/Pet.js';
import { Bowl } from '../game_objects/Bowl.js';

export class GameCanvas {
    /**
     * @param {HTMLCanvasElement} canvasElement The <canvas> DOM element.
     * @param {GameStateManager} gameStateManager The manager holding all game data.
     * @param {HTMLElement} comboDisplay The element to display the combo counter.
     */
    constructor(canvasElement, gameStateManager, comboDisplay) {
        this.canvas = canvasElement;
        this.ctx = this.canvas.getContext('2d');
        this.gameStateManager = gameStateManager;

        // Set the internal resolution of the canvas.
        this.canvas.width = 1280;
        this.canvas.height = 720;

        // Create the pet instance. Position it centered and near the bottom.
        const petX = (this.canvas.width - 256) / 2; // 256 is pet width
        const petY = this.canvas.height - 300; // Adjust as needed
        this.pet = new Pet(petX, petY);
        this.pet.setComboDisplay(comboDisplay);

        // Create the bowl instance
        const bowlX = this.canvas.width - 400;
        const bowlY = this.canvas.height - 150;
        this.bowl = new Bowl(bowlX, bowlY, this.gameStateManager.getLikes(), 200, 120);
        this.currentBowlId = null; // To track the currently rendered bowl type

        console.log('GameCanvas initialized.');
    }

    /**
     * Provides access to the Pet instance for other modules (like InputManager).
     * @returns {Pet}
     */
    getPet() {
        return this.pet;
    }

    /**
     * Provides access to the Bowl instance for other modules.
     * @returns {Bowl}
     */
    getBowl() {
        return this.bowl;
    }

    /**
     * Updates all animated objects in the canvas.
     * Should be called once per frame from the main game loop.
     */
    update() {
        this.pet.update();
    }

    /**
     * Renders the entire game scene in the correct order.
     * Should be called once per frame from the main game loop.
     */
    render() {
        // 1. Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 2. Draw the active background
        const background = this.gameStateManager.getActiveBackground();
        if (background && background.isLoaded) {
            background.render(this.ctx);
        }

        // 3. Draw the active floor
        const floor = this.gameStateManager.getActiveFloor();
        if (floor && floor.isLoaded) {
            floor.render(this.ctx);
        }

        // 4. Draw all draggable items from the user's inventory that are "placed"
        const userItems = this.gameStateManager.getUserInventory().getItems();
        userItems.forEach(item => {
            // Only render draggable items that are placed and loaded
            if (item.type === 'draggable' && item.isPlaced && item.isLoaded) {
                item.render(this.ctx);
            }
        });
        
        // 5. Draw the bowl
        const activeBowl = this.gameStateManager.getActiveBowl();
        if (activeBowl && activeBowl.isLoaded){
            this.bowl.setAppearance(activeBowl.frontSrc, activeBowl.backSrc);
            this.bowl.render(this.ctx);
            //console.log(activeBowl);
        }

        // 6. Draw the pet on top of everything else
        this.pet.render(this.ctx);
    }
}
