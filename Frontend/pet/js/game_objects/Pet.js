/*
    What is Pet.js?

    This file defines the Pet class, which is the central interactive character
    in the minigame. It manages its own state (like being idle or petted),
    handles its animations, and knows how to draw itself on the canvas.
*/

export class Pet {
    constructor(x, y) {
        // --- Positioning and Sizing ---
        this.x = x;
        this.y = y;
        this.width = 256; 
        this.height = 256;

        // --- State Management ---
        this.state = 'idle'; // Can be 'idle', 'petting'
        this.idleTimer = null; // Timer to return to idle state
        this.combo = 0;
        this.comboTimeout = null;
        this.comboDisplay = null;

        // --- Animation ---
        this.idleFrames = [];
        this.pettingSprite = new Image();
        this.areSpritesLoaded = false;
        this.loadSprites();

        this.currentFrame = 0;
        this.animationSpeed = 10; // Higher is slower
        this.frameCount = 0;
    }

    /**
     * Pre-loads all the necessary image assets for the pet's animations.
     */
    loadSprites() {
        const idleFrameCount = 3;
        let loadedCount = 0;

        const onAllLoaded = () => {
            this.areSpritesLoaded = true;
            console.log('All pet sprites loaded.');
        };

        // Load petting sprite
        this.pettingSprite.src = './img/pet_assets/petting/petting.png';
        this.pettingSprite.onload = () => {
            loadedCount++;
            if (loadedCount === idleFrameCount + 1) {
                onAllLoaded();
            }
        };

        // Load idle animation frames
        for (let i = 0; i < idleFrameCount; i++) {
            const frame = new Image();
            frame.src = `./img/pet_assets/pet-idle/idle000${i}.png`;
            this.idleFrames.push(frame);
            frame.onload = () => {
                loadedCount++;
                if (loadedCount === idleFrameCount + 1) {
                    onAllLoaded();
                }
            };
        }
    }

    /**
     * Checks if a given coordinate pair is within the bounds of the pet.
     * @param {number} x The x-coordinate of the click/touch.
     * @param {number} y The y-coordinate of the click/touch.
     * @returns {boolean} True if the coordinates are inside the pet.
     */
    isClicked(x, y) {
        return (
            x >= this.x &&
            x <= this.x + this.width &&
            y >= this.y &&
            y <= this.y + this.height
        );
    }

    setComboDisplay(element) {
        this.comboDisplay = element;
    }

    /**
     * Handles the logic when the pet is petted.
     * It changes the state and increases happiness.
     */
    handlePet() {
        this.state = 'petting';
        this.combo++;

        this.comboDisplay.classList.add('game-combo-animation');
        setTimeout(()=>{
            if (this.comboDisplay.classList.contains('game-combo-animation')){
                this.comboDisplay.classList.remove('game-combo-animation');    
            }
        },100);   

        if (this.comboDisplay) {
            this.comboDisplay.innerText = `+${this.combo}`;
            this.comboDisplay.classList.add('active');
        }
        
        // Clear any existing timer to reset the countdown
        clearTimeout(this.idleTimer);
        clearTimeout(this.comboTimeout);

        // After a short time of no petting, return to the idle state
        this.idleTimer = setTimeout(() => {
            this.state = 'idle';
        }, 500); // Stay in petting state for 0.5 seconds after the last pet

        this.comboTimeout = setTimeout(() => {
            this.combo = 0;
            if (this.comboDisplay) {
                this.comboDisplay.classList.remove('active');
            }
        }, 2000); // Reset combo after 2 seconds of inactivity
    }

    /**
     * Updates the pet's animation frame. Should be called in the game loop.
     */
    update() {
        if (this.state === 'idle') {
            this.frameCount++;
            if (this.frameCount >= this.animationSpeed) {
                this.frameCount = 0;
                this.currentFrame = (this.currentFrame + 1) % this.idleFrames.length;
            }
        }
    }

    /**
     * Draws the pet's current sprite on the canvas.
     * @param {CanvasRenderingContext2D} ctx The canvas rendering context.
     */
    render(ctx) {
        if (!this.areSpritesLoaded) {
            return; // Don't draw if sprites aren't ready
        }

        let currentSprite;
        if (this.state === 'petting') {
            currentSprite = this.pettingSprite;
        } else { // 'idle'
            currentSprite = this.idleFrames[this.currentFrame];
        }

        if (currentSprite) {
            ctx.drawImage(currentSprite, this.x, this.y, this.width, this.height);
        }
    }
}
