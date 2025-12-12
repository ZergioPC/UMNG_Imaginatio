extends Node

var INVENTORY:Array = []

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

func addItem(item:Dictionary) -> void:
	INVENTORY.append(item)
