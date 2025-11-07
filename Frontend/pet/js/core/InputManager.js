/*
 What is InputManager.js?

 Think of the InputManager as the nervous system of your minigame. It's responsible for listening to all user inputs—like clicks, drags, and touch gestures—and deciding what to do with them.

 Its primary responsibilities are:
  1. Event Listening: It attaches itself to the game's canvas to listen for mouse and touch events.
  2. Input Interpretation: It translates raw input, like a touch at coordinates (x, y), into a meaningful game action.
  3. State Delegation: It doesn't change the game state directly. Instead, it tells the GameStateManager or other components what action needs to be taken (e.g., "the user is petting the pet" or "the user is dragging an item").

 This separation of concerns keeps the core game logic clean and makes it easier to manage different types of input.
*/

// InputManager.js

/**
 * Manages all user input for the game, including mouse and touch events.
 */
export class InputManager {
    /**
     * @param {HTMLCanvasElement} canvas The canvas element to listen for events on.
     * @param {GameCanvas} gameCanvas The canvas renderer to interact with.
     * @param {GameStateManager} gameStateManager The state manager to send commands to.
     */
    constructor(canvas, gameCanvas, gameStateManager) {
        this.canvas = canvas;
        this.gameCanvas = gameCanvas;
        this.gameStateManager = gameStateManager;

        // State for dragging items
        this.selectedItem = null;
        this.offsetX = 0;
        this.offsetY = 0;

        // State for the petting gesture
        this.isPetting = false;
        this.lastPetY = 0;
        this.petThreshold = 20; // Pixels of vertical movement to trigger a "pet"

        this.setupEventListeners();
        console.log('InputManager initialized with touch and mouse support.');
    }

    /**
     * Attaches mouse and touch event listeners to the canvas.
     */
    setupEventListeners() {
        // Mouse Events
        this.canvas.addEventListener('mousedown', this.handleInteractionStart.bind(this));
        this.canvas.addEventListener('mousemove', this.handleInteractionMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleInteractionEnd.bind(this));
        this.canvas.addEventListener('mouseleave', this.handleInteractionEnd.bind(this));

        // Touch Events
        this.canvas.addEventListener('touchstart', this.handleInteractionStart.bind(this));
        this.canvas.addEventListener('touchmove', this.handleInteractionMove.bind(this));
        this.canvas.addEventListener('touchend', this.handleInteractionEnd.bind(this));
        this.canvas.addEventListener('touchcancel', this.handleInteractionEnd.bind(this));
    }

    /**
     * Gets the normalized (x, y) coordinates from a mouse or touch event.
     * @param {MouseEvent | TouchEvent} event
     * @returns {{x: number, y: number} | null}
     */
    getEventCoordinates(event) {
        const rect = this.canvas.getBoundingClientRect();

        // Get the raw click/touch position relative to the viewport, handling both event types
        const clientX = event.clientX ?? event.touches?.[0]?.clientX;
        const clientY = event.clientY ?? event.touches?.[0]?.clientY;

        if (clientX === undefined || clientY === undefined) {
            return null; // No coordinates found
        }

        // Calculate the position of the click relative to the canvas element on the page
        const relativeX = clientX - rect.left;
        const relativeY = clientY - rect.top;

        // Scale the coordinates from the element's display size (CSS size) to the canvas's internal resolution
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        return {
            x: relativeX * scaleX,
            y: relativeY * scaleY,
        };
    }

    /**
     * Handles the start of an interaction (mousedown or touchstart).
     * @param {MouseEvent | TouchEvent} event
     */
    handleInteractionStart(event) {
        event.preventDefault();
        const coords = this.getEventCoordinates(event);
        if (!coords) return;

        // Priority 1: Check for petting
        const pet = this.gameCanvas.getPet();
        if (pet && pet.isClicked(coords.x, coords.y)) {
            this.isPetting = true;
            this.lastPetY = coords.y;
            return; // Exclusive action
        }

        // Priority 2: Check for item dragging
        const items = this.gameStateManager.getUserInventory().getItems();
        // Loop backwards to correctly select items that are drawn on top
        for (let i = items.length - 1; i >= 0; i--) {
            const item = items[i];
            // Only allow dragging for items marked as 'draggable'
            if (item.type === 'draggable' && item.isClicked(coords.x, coords.y)) {
                this.selectedItem = item;
                this.offsetX = coords.x - item.x;
                this.offsetY = coords.y - item.y;
                console.log(`Selected ${item.name} to drag.`);
                return; // Exclusive action
            }
        }
    }

    /**
     * Handles movement during an interaction (mousemove or touchmove).
     * @param {MouseEvent | TouchEvent} event
     */
    handleInteractionMove(event) {
        event.preventDefault();
        const coords = this.getEventCoordinates(event);
        if (!coords) return;

        // Handle petting gesture
        if (this.isPetting) {
            const pet = this.gameCanvas.getPet();
            const deltaY = Math.abs(coords.y - this.lastPetY);

            if (pet && deltaY > this.petThreshold) {
                pet.handlePet();
                console.log('Pet was petted!');
                this.lastPetY = coords.y; // Reset position to allow continuous petting
            }
            return;
        }

        // Handle item dragging
        if (this.selectedItem) {
            this.selectedItem.x = coords.x - this.offsetX;
            this.selectedItem.y = coords.y - this.offsetY;
        }
    }

    /**
     * Handles the end of an interaction (mouseup, mouseleave, touchend, touchcancel).
     * @param {MouseEvent | TouchEvent} event
     */
    handleInteractionEnd(event) {
        // Finalize item dragging
        if (this.selectedItem) {
            console.log(`Placed ${this.selectedItem.name}.`);
            this.gameStateManager.moveItem(
                this.selectedItem.id,
                this.selectedItem.x,
                this.selectedItem.y
            );
        }

        // Reset all interaction states
        this.selectedItem = null;
        this.isPetting = false;
    }
}