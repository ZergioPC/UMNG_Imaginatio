extends Node

var ITEMS:Array[Dictionary] = []

func buyItem(id:int) -> Dictionary:
	var noMoney = false
	var wasBought = false
	for item in ITEMS:
		if (item["id"] == id):
			for prop in InventoryManager.INVENTORY: 	# Busca si ya esta en Inventario
				if (item["id"] == prop["id"]):
					wasBought = true
					break
			if (item["price"] > UserManager.MONEY):	#Comprobar si tiene plata
				noMoney = true
			else:
				if wasBought: continue
				UserManager.MONEY -= item["price"]
				InventoryManager.addItem(item)
				UserManager.emitNewMoney(UserManager.MONEY)
				
				var data = SaveDataManager.formatData(
					UserManager.PET_NAME,
					UserManager.MONEY,
					InventoryManager.INVENTORY,
					UserManager.HOUSE_FLOOR,
					UserManager.HOUSE_ROOF,
					UserManager.HOUSE_WALL
				)
				SaveDataManager.saveData(data)
			break
	return {
		"noMoney":noMoney, 
		"wasBought":wasBought
	}

func loadItems() -> void:
	var DATA = SaveDataManager.fetchData()
	
	for item in DATA:
		var loadTexture = load(item.texture)
		item.texture = loadTexture
		if item.type == "prop":
			pass
		if item.type == "skin":
			pass
		ITEMS.append(item)
"""
REGLAS PARA EL "ID" DE UN ITEM
- Empieza con el año: 
	* 2025
- Sigue el tipo:
	* prop: 0
	* skin: 1
- Agregar por ultimo el tamaño de la lista +1 de la siguiente forma:
	* Del  0 al  9: 0X
	* Del 11 al 99: XX
"""
