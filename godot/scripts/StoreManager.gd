extends Node

var ITEMS:Array[Dictionary] = []

func _ready() -> void:
	loadItems()

func loadItems() -> void:
	const path = "res://assets/petHouse/"
	var auxData = [
		{
			"id": 0,
			"name":"Casa espacial",
			"price":4,
			"texture":path + "CASA_ESP.png",
			"isUse":randf() < 0.5,
			"pos":Vector3(0,0,-1),
			"scale":Vector3(1000,1000,0.5)
		},{
			"id": 1,
			"name":"Casa Millos",
			"price":4,
			"texture":path + "CASA_MLL.png",
			"isUse":randf() < 0.5,
			"pos":Vector3(1,0,-2),
			"scale":Vector3(1000,1000,0.5)
		},{
			"id": 2,
			"name":"Casa Vaquera",
			"price":4,
			"texture":path + "CASA_VAK.png",
			"isUse":randf() < 0.5,
			"pos":Vector3(-1,0,-2.5),
			"scale":Vector3(1000,1000,0.5)
		}
	]
	for item in auxData:
		ITEMS.append(item)
		ITEMS.append(item)
		ITEMS.append(item)
		ITEMS.append(item)
		ITEMS.append(item)
		ITEMS.append(item)
		ITEMS.append(item)
