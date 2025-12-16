extends Control

@onready var container:HBoxContainer = $ScrollContainer/MarginContainer/HBoxContainer

func _ready() -> void:
	GameStateManager.connect("state_changed", _on_state_changed)

func create_custom_button(type:String, inUse:bool, texture:Texture2D, callback:Callable) -> Button:
	var button := Button.new()
	button.custom_minimum_size = Vector2i(150,150)

	var margin := MarginContainer.new()
	margin.set_anchors_preset(Control.PRESET_FULL_RECT)
	margin.add_theme_constant_override("margin_left",9)
	margin.add_theme_constant_override("margin_top",9)
	margin.add_theme_constant_override("margin_right",9)
	margin.add_theme_constant_override("margin_bottom",9)
	button.add_child(margin)

	var texture_rect := TextureRect.new()
	texture_rect.texture = texture
	texture_rect.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	texture_rect.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	margin.add_child(texture_rect)

	var inner_label := Label.new()
	inner_label.text = type
	inner_label.size_flags_horizontal = Control.SIZE_SHRINK_BEGIN
	inner_label.size_flags_vertical = Control.SIZE_SHRINK_BEGIN
	margin.add_child(inner_label)

	if inUse:
		texture_rect.modulate = Color(0.0, 0.3, 0.3, 0.5)
		
		var outer_label := Label.new()
		outer_label.text = "en Uso"
		outer_label.set_offsets_preset(Control.PRESET_BOTTOM_RIGHT)
		outer_label.set_anchors_preset(Control.PRESET_BOTTOM_RIGHT)
		button.add_child(outer_label)
	
	button.button_up.connect(callback)

	return button

func drawItems():
	deleteChildrens()
	
	for item in InventoryManager.INVENTORY:
		var btn = create_custom_button(
			item.type, 
			item.isUse, 
			item["texture"],
			func(): 
			if(item["type"] == "prop"): 
				InventoryManager.updateItemVisible(item["id"],not item["isUse"])
			if(item["type"]=="skin" and not item["isUse"]): 
				InventoryManager.updateSkinVisible(item["id"],item["texture"],item["skinOf"])
			drawItems()
		)
		container.add_child(btn)

func deleteChildrens():
	if (container.get_child_count() > 0):
		for child in container.get_children():
			child.queue_free()

func _on_state_changed(_new_state) -> void:
	drawItems()
