extends Control

@onready var container:HBoxContainer = $ScrollContainer/MarginContainer/HBoxContainer

func _ready() -> void:
	GameStateManager.connect("state_changed", _on_state_changed)

#region Button Component
func create_custom_button(
	item:Dictionary,
	type:String, 
	inUse:bool, 
	texture:Texture2D, 
	callback:Callable
) -> Button:
	var innerLabelText:String = "" 
	
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
	texture_rect.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	texture_rect.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	if (item.type == "skin"):
		match item.skinOf:
			"roof":
				texture_rect.texture = UTILS.crop_texture(
					texture,460,600,220,220
				)
				innerLabelText = "Techo"
			"wall":
				texture_rect.texture = UTILS.crop_texture(
					texture,850,50,110,110
				)
				innerLabelText = "Pared"
			"floor":
				texture_rect.texture = texture
				innerLabelText = "Suelo"
	else:
		innerLabelText = "Item"
		texture_rect.texture = texture
	margin.add_child(texture_rect)

	var inner_label := Label.new()
	inner_label.text = innerLabelText
	inner_label.size_flags_horizontal = Control.SIZE_SHRINK_BEGIN
	inner_label.size_flags_vertical = Control.SIZE_SHRINK_BEGIN
	inner_label.theme = load("res://styles/Inventory/Label_type.tres")
	margin.add_child(inner_label)

	if inUse:
		var materialnew := ShaderMaterial.new()
		materialnew.shader = load("res://styles/Inventory/Texture_shader.gdshader")
		materialnew.set_shader_parameter("pixel_size", 12.0)
		materialnew.set_shader_parameter("enable_pixelation", true)
		materialnew.set_shader_parameter("enable_palette", false)
		materialnew.set_shader_parameter("enable_grayscale", true)

		texture_rect.material = materialnew
		
		var outer_label := Label.new()
		outer_label.text = "En Uso"
		outer_label.set_offsets_preset(Control.PRESET_BOTTOM_RIGHT)
		outer_label.set_anchors_preset(Control.PRESET_BOTTOM_RIGHT)
		outer_label.z_index = 2
		outer_label.theme = load("res://styles/Inventory/Label_inUse.tres")
		button.add_child(outer_label)
	
	button.button_up.connect(callback)

	return button
#endregion

func drawItems():
	deleteChildrens()
	
	for item in InventoryManager.INVENTORY:
		var btn = create_custom_button(
			item,
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
