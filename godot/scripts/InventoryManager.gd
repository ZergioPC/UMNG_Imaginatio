extends Node

var INVENTORY:Array = []

func updateItemPos(id:int, value:Vector3):
	for item in INVENTORY:
		if not item.has("id"):
			continue 
		if item.id == id:
			item["pos"] = [value.x, value.y, value.z]
			break

func updateItemVisible(id:int, value:bool):
	for item in INVENTORY:
		if not item.type == "prop":
			continue 
		if not item.id == id:
			continue
		item.isUse = value
		if value:
			PropsManager.addProp(id)
			break
		else:
			PropsManager.removeProp(id)
			break

func updateSkinVisible(id:int, texture:Texture2D, element:String):
	for item in INVENTORY:
		if not item.type == "skin":
			continue 
		if not item.skinOf == element:
			continue
		
		if not item.id == id:
			item.isUse = false
		else:
			item.isUse = true
	
	match element:
		"wall":
			UserManager.house_changeWall.emit(id, texture)
		"floor":
			UserManager.house_changeFloor.emit(id, texture)
		"roof":
			UserManager.house_changeRoof.emit(id, texture)

func addItem(item:Dictionary) -> void:
	INVENTORY.append(item)

func loadStorageData(list:Array):
	for prop in list:
		for item in StoreManager.ITEMS:
			if (item["id"] == prop["id"]):
				var newItem = item
				if item.has("pos"): newItem["pos"] = prop["pos"]
				newItem["isUse"] = prop["isUse"]
				addItem(newItem)
				break

"""
|---JSON PARSED---|
{ 
"inventory": [
	{ "id": 1, "pos": "(-1.14, 0, -0.748373)" },
	{ "id": 0, "pos": "(-0.753796, 0, -1.903471)" }
"likes": 28,
"name": "PEPO"
}

|---Inventario---|
[{ 
	"id": 1, 
	"name": "Casa Millos", 
	"price": 4,
	"texture": "res://assets/petHouse/CASA_MLL.png", 
	"isUse": false, "pos": "(-1.14, 0, -0.748373)", 
	"scale": [1000, 1000, 0.5]
},{ 
	"id": 0, 
	"name": "Casa espacial", 
	"price": 4, 
	"texture": "res://assets/petHouse/CASA_ESP.png", 
	"isUse": false, 
	"pos": "(-0.753796, 0, -1.903471)", 
	"scale": [1000, 1000, 0.5] 
}]
"""
