/*
    What is constants.js?

    This file is a central place to store fixed data for the game.
    By keeping this data here, we can easily tweak game balance (like item prices)
    or add new items without digging through the game's logic files.

    It makes the code cleaner and easier to manage.
*/

/**
 * Master data for all purchasable items in the game.
 *
 * Each item has a unique ID that acts as the key.
 *
 * Properties:
 * - name: The display name of the item.
 * - price: The cost of the item in "Likes".
 * - src: The path to the item's image file, relative to the main HTML file.
 * - width: The width of the item on the canvas.
 * - height: The height of the item on the canvas.
 *
 * IMPORTANT: The paths in `src` point to where the image files *should* be.
 * You must create these image assets for the items to appear in the game.
 */
export const ITEMS_DATA = {
    'house_base': {
        name: 'Casa Estandar',
        price: 4,
        src: './img/house_textures/CASA_BASE.png',
        width: 330,
        height: 220,
        type: "draggable"
    },
    'house_space': {
        name: 'Casa Espacial',
        price: 12,
        src: './img/house_textures/CASA_ESP.png',
        width: 330,
        height: 320,
        type: "draggable"
    },
    'house_cowboy': {
        name: 'Casa Vaquera',
        price: 12,
        src: './img/house_textures/CASA_VAK.png',
        width: 330,
        height: 320,
        type: "draggable"
    },
    'house_rich': {
        name: 'Casa de Rico',
        price: 19,
        src: './img/house_textures/CASA_MLL.png',
        width: 330,
        height: 320,
        type: "draggable"
    },
    'background_base': {
        name: 'Fondo Base',
        price: 0,
        src: './img/background_texture/FONDO_BASE.png',
        width: 1280,
        height: 720,  
        type: "background"
    }
    ,
    'background_space': {
        name: 'Fondo Espacial',
        price: 10,
        src: './img/background_texture/FONDO_ESP.png',
        width: 1280,
        height: 720,  
        type: "background"
    },
    'floor_base': {
        name: 'Suelo Base',
        price: 0,
        src: './img/background_texture/PISO_BASE.png',
        width: 1280,
        height: 720,  
        type: "floor"
    },
    'floor_space': {
        name: 'Suelo Espacial',
        price: 10,
        src: './img/background_texture/PISO_ESP.png',
        width: 1280,
        height: 720,  
        type: "floor"
    },
    'bowl_base': {
        name: 'Plato Base',
        price: 0,
        src: './img/bowl_store_texture/BASE.png',
        type: "bowl",
        frontSrc: './img/bowl_texture/PLATO_BASE_frnt.png',
        backSrc: './img/bowl_texture/PLATO_BASE_bck.png'
    },
    'bowl_space': {
        name: 'Plato Espacial',
        price: 15,
        src: './img/bowl_store_texture/ESP.png',
        type: "bowl",
        frontSrc: './img/bowl_texture/PLATO_ESP_frnt.png',
        backSrc: './img/bowl_texture/PLATO_ESP_bck.png'
    },
    'bowl_cowboy': {
        name: 'Plato Vaquero',
        price: 15,
        src: './img/bowl_store_texture/VAK.png',
        type: "bowl",
        frontSrc: './img/bowl_texture/PLATO_VAK_frnt.png',
        backSrc: './img/bowl_texture/PLATO_VAK_bck.png'
    },
    'bowl_rich': {
        name: 'Plato de Rico',
        price: 22,
        src: './img/bowl_store_texture/MILL.png',
        type: "bowl",
        frontSrc: './img/bowl_texture/PLATO_MLL_frnt.png',
        backSrc: './img/bowl_texture/PLATO_MLL_bck.png'
    }
};
