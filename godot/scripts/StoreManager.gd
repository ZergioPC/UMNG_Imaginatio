extends Node

var ITEMS:Array[Dictionary] = []

func buyItem(id:int) -> Array[bool]:
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
			break
	return [noMoney, wasBought]

func loadItems() -> void:
	const path = "res://assets/petHouse/"
	var auxData = [
		{
			"id": 0,
			"name":"Casa espacial",
			"price":4,
			"texture":path + "CASA_ESP.png",
			"isUse":false,
			"pos":[0, 0, 0],
			"scale":[1000, 1000, 0.5]
		},{
			"id": 1,
			"name":"Casa Millos",
			"price":4,
			"texture":path + "CASA_MLL.png",
			"isUse":false,
			"pos":[0, 0, 0],
			"scale":[1000, 1000, 0.5]
		},{
			"id": 2,
			"name":"Casa Vaquera",
			"price":4,
			"texture":path + "CASA_VAK.png",
			"isUse":false,
			"pos":[0, 0, 0],
			"scale":[1000, 1000, 0.5]
		}
	]
	for item in auxData:
		ITEMS.append(item)
