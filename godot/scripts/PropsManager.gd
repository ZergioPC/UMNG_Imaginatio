extends Node

@onready var Inventario = InventoryManager.INVENTORY
var PropsList:Array[Item] = []
var customization_mode: bool = false
var PropsNode:Node3D

func _ready() -> void:
	loadProps()
	GameStateManager.connect("state_changed", _on_state_changed)
	#print(Inventario)

func loadProps() -> void:
	for prop in Inventario:
		if not prop["isUse"] : continue
		var texture:Texture2D = load(prop["texture"])
		var item_instance := Item.new(prop["id"], prop["scale"],texture)
		item_instance.position = prop["pos"]
		item_instance.updatePos()
		PropsList.append(item_instance)

func drawProps():
	for prop in PropsList:
		prop.updatePos()
		PropsNode.add_child(prop)

func addProp(id:int):
	for prop in Inventario:
		if (prop["id"] == id):
			var texture:Texture2D = load(prop["texture"])
			var item_instance := Item.new(prop["id"], prop["scale"],texture)
			item_instance.position = prop["pos"]
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
