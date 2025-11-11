/*
    What is InventoryUI.js?

    This module is responsible for rendering and managing the in-game inventory's
    HTML interface. It communicates with the GameStateManager to get the user's
    owned items and allows the user to interact with them (e.g., place/remove,
    activate).
*/

export class InventoryUI {
    /**
     * @param {GameStateManager} gameStateManager The central state manager.
     * @param {HTMLElement} inventoryElement The <aside> element for the inventory.
     * @param {HTMLElement} storeElement The <aside> element for the store.
     */
    constructor(gameStateManager, inventoryElement, storeElement) {
        this.gameStateManager = gameStateManager;
        this.inventoryElement = inventoryElement;
        this.storeElement = storeElement; // To hide it when inventory opens
        this.isVisible = false;

        this.inventoryElement.classList.add('pet-menu', 'hidden');
    }

    /**
     * Toggles the visibility of the inventory menu.
     */
    toggle() {
        this.isVisible = !this.isVisible;
        if (this.isVisible) {
            this.render();
            this.inventoryElement.classList.remove('hidden');
        } else {
            this.inventoryElement.classList.add('hidden');
        }
    }

    /**
     * Renders the entire inventory UI based on the current game state.
     */
    render() {
        const userInventory = this.gameStateManager.getUserInventory().getItems();
        const activeBackgroundId = this.gameStateManager.activeBackgroundId;
        const activeFloorId = this.gameStateManager.activeFloorId;

        this.inventoryElement.innerHTML = `
            <div class="pet-menu-header">
                <h2>Inventory</h2>
                <button class="close-button">X</button>
            </div>
            <div class="pet-menu-items">
                ${userInventory.length > 0 ? userInventory.map(item => this.createItemHTML(item, activeBackgroundId, activeFloorId)).join('') : '<p class="empty-message">Your inventory is empty. Visit the store!</p>'}
            </div>
        `;

        this.addEventListeners();
    }

    /**
     * Creates the HTML string for a single item in the inventory.
     * @param {Item} item The item to render.
     * @param {string} activeBackgroundId
     * @param {string} activeFloorId
     * @returns {string}
     */
    createItemHTML(item, activeBackgroundId, activeFloorId) {
        let buttonHTML = '';
        switch (item.type) {
            case 'draggable':
                buttonHTML = `<button class="action-button" data-item-id="${item.id}" data-action="toggle-placement">${item.isPlaced ? 'Remove' : 'Place'}</button>`;
                break;
            case 'background':
                const isBgActive = item.id === activeBackgroundId;
                buttonHTML = `<button class="action-button" data-item-id="${item.id}" data-action="activate-background" ${isBgActive ? 'disabled' : ''}>${isBgActive ? 'Active' : 'Activate'}</button>`;
                break;
            case 'floor':
                const isFloorActive = item.id === activeFloorId;
                buttonHTML = `<button class="action-button" data-item-id="${item.id}" data-action="activate-floor" ${isFloorActive ? 'disabled' : ''}>${isFloorActive ? 'Active' : 'Activate'}</button>`;
                break;
        }

        return `
            <div class="pet-menu-item">
                <div class="item-preview" style="background-image: url('${item.sprite.src}')"></div>
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p>${item.type}</p>
                </div>
                ${buttonHTML}
            </div>
        `;
    }

    /**
     * Attaches event listeners to the buttons in the inventory UI.
     */
    addEventListeners() {
        // Close button
        this.inventoryElement.querySelector('.close-button').addEventListener('click', () => {
            this.toggle();
        });

        // Action buttons
        this.inventoryElement.querySelectorAll('.action-button:not(:disabled)').forEach(button => {
            button.addEventListener('click', (event) => {
                const itemId = event.target.dataset.itemId;
                const action = event.target.dataset.action;
                let success = false;

                switch (action) {
                    case 'toggle-placement':
                        success = this.gameStateManager.toggleItemPlacement(itemId);
                        break;
                    case 'activate-background':
                        success = this.gameStateManager.setActiveBackground(itemId);
                        break;
                    case 'activate-floor':
                        success = this.gameStateManager.setActiveFloor(itemId);
                        break;
                }
                
                if (success) {
                    // Re-render the inventory to update button states
                    this.render();
                }
            });
        });
    }
}
