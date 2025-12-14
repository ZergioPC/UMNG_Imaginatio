extends Control

@onready var container:HBoxContainer = $ScrollContainer/MarginContainer/HBoxContainer

func _ready() -> void:
	GameStateManager.connect("state_changed", _on_state_changed)

func drawItems():
	deleteChildrens()
	
	for item in InventoryManager.INVENTORY:
		var btn:Button = Button.new()
		btn.custom_minimum_size = Vector2i(150,150)
		btn.button_up.connect(
			func():
			if(item["type"] == "prop"): 
				InventoryManager.updateItemVisible(item["id"],not item["isUse"])
			if(item["type"]=="skin" and not item["isUse"]): 
				InventoryManager.updateSkinVisible(item["id"],item["texture"],item["skinOf"])
			drawItems()
			)
		
		var rect:TextureRect = TextureRect.new()
		rect.texture = load(item["texture"])
		rect.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
		rect.stretch_mode =TextureRect.STRETCH_KEEP_ASPECT_CENTERED
		rect.custom_minimum_size = Vector2(150,150)
		rect.visible = true
		
		if(not item["isUse"]):
			rect.modulate = Color(0.0, 0.3, 0.3, 0.5)
		
		btn.add_child(rect)
		container.add_child(btn)

func deleteChildrens():
	if (container.get_child_count() > 0):
		for child in container.get_children():
			child.queue_free()

func _on_state_changed(_new_state) -> void:
	drawItems()
