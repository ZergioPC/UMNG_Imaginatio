extends Node

var INVENTORY:Array = []
var inventoryOpen:bool = false

func _ready() -> void:
	__tempLoadItems()

func updateItem(id:int, property:String, value):
	for item in INVENTORY:
		if not item.has("id"):
			continue 
		if not item.id == id:
			continue
		item[property] = value
		if value:
			PropsManager.addProp(id)
		else:
			PropsManager.removeProp(id)


func __tempLoadItems():
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
		INVENTORY.append(item)
