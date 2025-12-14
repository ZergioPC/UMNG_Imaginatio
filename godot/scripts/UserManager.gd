extends Node

var PET_NAME:String = "PEPO"
var MONEY:int = 40

# UserManager.house_changeFloor.emit(
# 	load("res://assets/house/House_floor_rich.png")
# )

signal house_changeFloor(texture:Texture2D)
signal house_changeRoof(texture:Texture2D)
signal house_changeWall(texture:Texture2D)
