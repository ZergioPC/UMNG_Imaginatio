# Construcción del funcionamiento de la Mascota

La mascota tiene un estilo **Tamagochi,** donde el usuario puede decorar el espacio con diferentes elementos estéticos, los cuales puede adquirir en una tienda teniendo como moneda de cambio los **Likes** que ha dado a las publicaciones. Se debe de cumplir los siguientes requisitos

* Acariciar a la mascota.
* La tienda debe identificar que items que ya compró el usuario.
* El usuario puede modificar la ubicación de los items.

## Diagrama de Flujo

```mermaid
flowchart LR 
    DB[(Local Storage)]

    M2[get data]
    M1[save data]

    DB---M2
    DB---M1

    subgraph Global
        A3(Update User Data)
        A1(User Data)
        A2(Update Sprites)
        A4(Store Data)
        B(GUI)
    end

    subgraph Canvas
        C1(Inventario)
        C11(EditarPosicion)
        C12(Items)
        C2(Plato Comida)
        C3(Mascota)
        C31(Acariciar)

        C1---C11
        C11---C12
        C3---C31
    end
    subgraph Tienda
        D1(Lista de Objetos)
        D2(Likes disponibles)
        D3[Comprar]
    end
    
    M2---A1
    M1---A2
    M1---A3
    
    A2---C1
    A2---C2
    A2---C3

    A1---D1
    A1---D2
    A3---D3    
```

## Diagrama de Clases

```mermaid
classDiagram
direction LR
class LocalStorageManager {
    +save(data)
    +load()
}
class GameStateManager {
    -userLikes: int
    -userItems: UserInventory
    -storeItems: StoreInventory
    +purchaseItem(itemId)
    +moveItem(itemId, x, y)
    +getLikes()
    +getUserItems()
}
class Pet {
    -happiness: int
    -state: String
    +render(canvasContext)
    +handlePet()
}
class Item {
    +id: String
    +name: String
    +price: int
    +sprite: Image
    +x: int
    +y: int
    +render(canvasContext)
}
class UserInventory {
    -items: Map~String, Item~
    +addItem(item)
    +getItem(id)
}
class StoreInventory {
    -itemsForSale: Map~String, Item~
    +render(uiElement)
    +handlePurchase(itemId)
}
class GameCanvas {
    -pet: Pet
    -items: Item[]
    +render()
}
class InputManager {
    +setupEventListeners(canvas)
    +handleCanvasClick(event)
}

GameStateManager o-- LocalStorageManager
GameStateManager o-- UserInventory
GameStateManager o-- StoreInventory
GameCanvas o-- Pet
GameCanvas "1" -- "0..*" Item
InputManager ..> GameStateManager : sends commands
InputManager ..> GameCanvas : detects clicks on
```