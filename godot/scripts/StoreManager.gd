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
	const path2 = "res://assets/house/"
	
	var auxData = [
		{
			"id": 0,
			"name":"Casa espacial",
			"price":4,
			"texture":path + "CASA_ESP.png",
			"isUse":false,
			"pos":[0, 0, 0],
			"scale":[1000, 1000, 0.5],
			"type":"prop"
		},{
			"id": 1,
			"name":"Casa Millos",
			"price":4,
			"texture":path + "CASA_MLL.png",
			"isUse":false,
			"pos":[0, 0, 0],
			"scale":[1000, 1000, 0.5],
			"type":"prop"
		},{
			"id": 2,
			"name":"Casa Vaquera",
			"price":4,
			"texture":path + "CASA_VAK.png",
			"isUse":false,
			"pos":[0, 0, 0],
			"scale":[1000, 1000, 0.5],
			"type":"prop"
		},{
			"id": 3,
			"name":"Suelo Base",
			"price":4,
			"texture":path2 + "House_floor_base.png",
			"isUse":false,
			"preview":"_",
			"skinOf":"floor",
			"type":"skin"
		},{
			"id": 4,
			"name":"Suelo Millonario",
			"price":4,
			"texture":path2 + "House_floor_rich.png",
			"isUse":false,
			"preview":"_",
			"skinOf":"floor",
			"type":"skin"
		},{
			"id": 5,
			"name":"Suelo Espacial",
			"price":4,
			"texture":path2 + "House_floor_space.png",
			"isUse":false,
			"preview":"_",
			"skinOf":"floor",
			"type":"skin"
		},{
			"id": 6,
			"name":"Techo Base",
			"price":4,
			"texture":path2 + "House_techo_base.png",
			"isUse":false,
			"preview":"_",
			"skinOf":"roof",
			"type":"skin"
		},{
			"id": 7,
			"name":"Techo Millonario",
			"price":4,
			"texture":path2 + "House_techo_rich.png",
			"isUse":false,
			"preview":"_",
			"skinOf":"roof",
			"type":"skin"
		},{
			"id": 8,
			"name":"Techo Espacial",
			"price":4,
			"texture":path2 + "House_techo_space.png",
			"isUse":false,
			"preview":"_",
			"skinOf":"roof",
			"type":"skin"
		},{
			"id": 9,
			"name":"Paredes Base",
			"price":4,
			"texture":path2 + "House_paredes_base.png",
			"isUse":false,
			"preview":"_",
			"skinOf":"wall",
			"type":"skin"
		},{
			"id": 10,
			"name":"Paredes Millonario",
			"price":4,
			"texture":path2 + "House_paredes_rich.png",
			"isUse":false,
			"preview":"_",
			"skinOf":"wall",
			"type":"skin"
		},{
			"id": 11,
			"name":"Paredes Espacial",
			"price":4,
			"texture":path2 + "House_paredes_space.png",
			"isUse":false,
			"preview":"_",
			"skinOf":"wall",
			"type":"skin"
		}
	]
	for item in auxData:
		ITEMS.append(item)
