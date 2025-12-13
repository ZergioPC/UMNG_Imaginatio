extends Node

@onready var Inventario = InventoryManager.INVENTORY
var PropsList:Array[Item] = []
var customization_mode: bool = false
var PropsNode:Node3D

func _auxCreateProp(prop:Dictionary) -> Item:
	var texture:Texture2D = load(prop["texture"])
	var item_instance := Item.new(prop["id"], prop["scale"],texture)
	var item_pos = Vector3(
		prop["pos"][0],
		prop["pos"][1],
		prop["pos"][2]
		)
	item_instance.position = item_pos
	return item_instance

func loadProps() -> void:
	for prop in Inventario:
		if not prop["isUse"] : continue
		var item_instance = _auxCreateProp(prop)
		item_instance.updatePos()
		PropsList.append(item_instance)

func drawProps():
	for prop in PropsList:
		prop.updatePos()
		PropsNode.add_child(prop)

func addProp(id:int):
	for prop in Inventario:
		if (prop["id"] == id):
			var item_instance = _auxCreateProp(prop)
			PropsList.append(item_instance)
	drawProps()

func removeProp(id: int):
	for i in range(len(PropsList)):
		if PropsList[i].id == id:
			var prop = PropsList[i]   # save reference
			PropsList.remove_at(i)    # remove from array
			prop.queue_free()         # free the correct node
			return
	drawProps()

func setPropsNode(node:Node3D):
	PropsNode = node
	drawProps()

func updatePositions():
	for prop in PropsList:
		InventoryManager.updateItemPos(prop.id,prop.global_position)

# SIGNALS

func _on_state_changed(new_state):
	match new_state:
		GameStateManager.GameState.EDIT:
			enable_customization_mode()
		_:
			disable_customization_mode()

func enable_customization_mode():
	customization_mode = true
	for prop in PropsList:
		prop.enable_editing()

func disable_customization_mode():
	customization_mode = false
	for prop in PropsList:
		prop.disable_editing()
