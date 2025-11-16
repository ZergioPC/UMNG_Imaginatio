/*
    What is main.js?

    This is the entry point for the entire minigame. It's responsible for:
    1. Waiting for the web page to finish loading.
    2. Finding the <canvas> element in the HTML.
    3. Initializing all the major game modules (GameStateManager, GameCanvas, InputManager, and UI).
    4. Starting the game loop, which runs continuously to update and render the game.
*/

// Import the core components of the game
import { GameStateManager } from './core/GameStateManager.js';
import { GameCanvas } from './rendering/GameCanvas.js';
import { InputManager } from './core/InputManager.js';
import { StoreUI } from './ui/StoreUI.js';
import { InventoryUI } from './ui/InventoryUI.js';


// Wait for the DOM to be fully loaded before starting the game
window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded. Initializing game...');
    
    // Get DOM elements
    const canvas = document.getElementById('game-canvas');
    if (!canvas) {
        console.error('Fatal Error: Canvas element with ID "game-canvas" not found!');
        return;
    }
    const storeMenu = document.getElementById('pet-store-menu');
    const inventoryMenu = document.getElementById('pet-invent-menu');
    const comboDisplay = document.querySelector('.game-combo');
    
    // --- INITIALIZATION ---
    const gameStateManager = new GameStateManager();
    const gameCanvas = new GameCanvas(canvas, gameStateManager, comboDisplay);
    const inputManager = new InputManager(canvas, gameCanvas, gameStateManager);

    // --- UI INITIALIZATION ---
    // We create a manager object to handle interactions between UI components.
    const uiManager = {};
    uiManager.store = new StoreUI(gameStateManager, storeMenu, uiManager);
    uiManager.inventory = new InventoryUI(gameStateManager, inventoryMenu, uiManager);

    // --- UI Event Listeners ---
    document.getElementById('game-store').addEventListener('click', () => {
        uiManager.store.toggle();
    });

    document.getElementById('game-inventory').addEventListener('click', () => {
        uiManager.inventory.toggle();
    });

    // --- GAME LOOP ---
    function gameLoop() {
        gameCanvas.update();
        gameCanvas.render();
        requestAnimationFrame(gameLoop);
    }

    // Start the game loop!
    console.log('All modules initialized. Starting game loop...');
    gameLoop();
});
