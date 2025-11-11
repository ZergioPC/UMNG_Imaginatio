/*
    What is StoreUI.js?

    This module is responsible for rendering and managing the in-game store's
    HTML interface. It communicates with the GameStateManager to get item data
    and process purchases, but it does not contain any core game logic itself.
    Its only job is to display the store and handle user clicks within it.
*/

export class StoreUI {
    /**
     * @param {GameStateManager} gameStateManager The central state manager.
     * @param {HTMLElement} storeElement The <aside> element for the store.
     * @param {Object} uiManager An object containing other UI components for interaction.
     */
    constructor(gameStateManager, storeElement, uiManager) {
        this.gameStateManager = gameStateManager;
        this.storeElement = storeElement;
        this.uiManager = uiManager; // To hide inventory when store opens
        this.isVisible = false;

        this.storeElement.classList.add('pet-menu', 'hidden');
    }

    /**
     * Toggles the visibility of the store menu.
     */
    toggle() {
        this.isVisible = !this.isVisible;
        if (this.isVisible) {
            // When opening the store, make sure the inventory is closed.
            if (this.uiManager.inventory && this.uiManager.inventory.isVisible) {
                this.uiManager.inventory.toggle();
            }
            this.render();
            this.storeElement.classList.remove('hidden');
        } else {
            this.storeElement.classList.add('hidden');
        }
    }

    /**
     * Renders the entire store UI based on the current game state.
     */
    render() {
        const storeInventory = this.gameStateManager.getStoreInventory();
        const userInventory = this.gameStateManager.getUserInventory();
        const userLikes = this.gameStateManager.getLikes();
        const items = storeInventory.getAllItems();

        // Filter out free items that are given by default
        const itemsForSale = items.filter(item => item.price > 0);

        this.storeElement.innerHTML = `
            <div class="pet-menu-header">
                <h2>Store</h2>
                <span>Your Likes: ${userLikes} ❤️</span>
                <button class="close-button">X</button>
            </div>
            <div class="pet-menu-items">
                ${itemsForSale.map(item => this.createItemHTML(item, userInventory, userLikes)).join('')}
            </div>
        `;

        this.addEventListeners();
    }

    /**
     * Creates the HTML string for a single item in the store.
     * @param {Item} item The item to render.
     * @param {Inventory} userInventory The user's current inventory.
     * @param {number} userLikes The user's current likes.
     * @returns {string}
     */
    createItemHTML(item, userInventory, userLikes) {
        const hasItem = userInventory.hasItem(item.id);
        const canAfford = userLikes >= item.price;

        return `
            <div class="pet-menu-item ${hasItem ? 'owned' : ''}">
                <div class="item-preview" style="background-image: url('${item.sprite.src}')"></div>
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p>Price: ${item.price} ❤️</p>
                </div>
                <button 
                    class="buy-button" 
                    data-item-id="${item.id}" 
                    ${hasItem || !canAfford ? 'disabled' : ''}
                >
                    ${hasItem ? 'Owned' : 'Buy'}
                </button>
            </div>
        `;
    }

    /**
     * Attaches event listeners to the buttons in the store UI.
     */
    addEventListeners() {
        // Close button
        this.storeElement.querySelector('.close-button').addEventListener('click', () => {
            this.toggle();
        });

        // Buy buttons
        this.storeElement.querySelectorAll('.buy-button:not(:disabled)').forEach(button => {
            button.addEventListener('click', (event) => {
                const itemId = event.target.dataset.itemId;
                const success = this.gameStateManager.purchaseItem(itemId);
                
                if (success) {
                    // Re-render the store to update likes and item statuses
                    this.render();
                } else {
                    // Provide feedback for failed purchase
                    alert("Purchase failed. You may not have enough likes or already own this item.");
                }
            });
        });
    }
}
