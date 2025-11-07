/*
    What is main.js?

    This is the entry point for the entire minigame. It's responsible for:
    1. Waiting for the web page to finish loading.
    2. Finding the <canvas> element in the HTML.
    3. Initializing all the major game modules (GameStateManager, GameCanvas, InputManager).
    4. Starting the game loop, which runs continuously to update and render the game.
*/

// Import the core components of the game
import { GameStateManager } from './core/GameStateManager.js';
import { GameCanvas } from './rendering/GameCanvas.js';
import { InputManager } from './core/InputManager.js';


// Wait for the DOM to be fully loaded before starting the game
window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded. Initializing game...');
    
    // Get the canvas element from the HTML.
    // IMPORTANT: Your <canvas> tag in index.html must have id="game-canvas"
    const canvas = document.getElementById('game-canvas');
    if (!canvas) {
        console.error('Fatal Error: Canvas element with ID "game-canvas" not found!');
        return;
    }
    
    // --- INITIALIZATION ---
    // The order is important here.
    // 1. Initialize the state manager (the "brain" that holds all data)
    const gameStateManager = new GameStateManager();

    // 2. Initialize the canvas renderer (the "eyes" that draw the state)
    const gameCanvas = new GameCanvas(canvas, gameStateManager);

    // 3. Initialize the input manager (the "nerves" that handle user actions)
    const inputManager = new InputManager(canvas, gameCanvas, gameStateManager);

    // --- GAME LOOP ---
    // This function runs on every frame to update animations and draw the scene.
    function gameLoop() {
        // Update game logic and animations (e.g., the pet's idle cycle)
        gameCanvas.update();

        // Render the entire scene
        gameCanvas.render();

        // Schedule the next frame to be drawn
        requestAnimationFrame(gameLoop);
    }

    // Start the game loop!
    console.log('All modules initialized. Starting game loop...');
    gameLoop();
});
