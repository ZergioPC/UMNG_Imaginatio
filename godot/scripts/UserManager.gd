extends Node

var PET_NAME:String = ""
var MONEY:int = 0

var HOUSE_WALL:int = 2025107
var HOUSE_ROOF:int = 2025104
var HOUSE_FLOOR:int = 2025101

signal house_changeFloor(id:int, texture:Texture2D)
signal house_changeRoof(id:int, texture:Texture2D)
signal house_changeWall(id:int, texture:Texture2D)

func initHouseMaterials():
	for item in InventoryManager.INVENTORY:
		if item["id"] == HOUSE_WALL:
			house_changeWall.emit(item["id"], item.texture)
		if item["id"] == HOUSE_ROOF:
			house_changeRoof.emit(item["id"], item.texture)
		if item["id"] == HOUSE_FLOOR:
			house_changeFloor.emit(item["id"], item.texture)
