extends Control

@onready var container:GridContainer = $MarginContainer/VBoxContainer/ScrollContainer/MarginContainer/GridItems

func _ready() -> void:
	drawItems()

#region Metodos
func drawItems() -> void:
	deleteChildrens()
	
	for itemStore in StoreManager.ITEMS:
		if itemStore["id"] == 1: continue
		if itemStore["id"] == 2: continue
		if itemStore["id"] == 3: continue
		
		var color:Color = Color(1.0, 1.0, 1.0, 1.0)
		var texture:Texture2D = itemStore.texture
		var wasBought:bool = false
		var itemId:int = itemStore["id"]
		var itemText:String = itemStore["name"]
		
		for itemInventory in InventoryManager.INVENTORY:
			if itemInventory.id == itemStore.id:
				color = Color(0.3, 0.5, 0.8, 0.6)
				wasBought = true
				print(itemStore.name, " cargado del Inventario")
				break
		
		var btn = create_button_tree(itemStore, itemId, itemText, color, wasBought, texture)
		container.add_child(btn)

func deleteChildrens():
	if (container.get_child_count() > 0):
		for child in container.get_children():
			child.queue_free()
#endregion

#region Componentes
func create_button_tree(
	item:Dictionary,
	itemId:int,
	itemTxt:String, 
	color:Color, 
	wasBought:bool, 
	texture:Texture2D
) -> Button:
	const onSaleSentence:String = "Agotado"
	
	var button := Button.new()
	button.custom_minimum_size = Vector2i(200,200)
	button.size_flags_horizontal = Control.SIZE_EXPAND_FILL

	var hbox := HBoxContainer.new()
	hbox.alignment = BoxContainer.ALIGNMENT_END
	hbox.set_anchors_preset(PRESET_FULL_RECT) 

	var margin := MarginContainer.new()
	margin.add_theme_constant_override("margin_left",15)
	margin.add_theme_constant_override("margin_top",15)
	margin.add_theme_constant_override("margin_right",15)
	margin.add_theme_constant_override("margin_bottom",15)
	margin.size_flags_horizontal = Control.SIZE_FILL
	margin.size_flags_vertical = Control.SIZE_FILL
	hbox.add_child(margin)

	var vbox := VBoxContainer.new()
	vbox.alignment = BoxContainer.ALIGNMENT_END
	vbox.size_flags_horizontal = Control.SIZE_FILL
	vbox.size_flags_vertical = Control.SIZE_FILL
	margin.add_child(vbox)

	var rich_text := RichTextLabel.new()
	rich_text.custom_minimum_size.x = 200
	rich_text.size_flags_horizontal = Control.SIZE_SHRINK_BEGIN
	rich_text.size_flags_vertical = Control.SIZE_SHRINK_CENTER
	rich_text.fit_content = true
	rich_text.text = itemTxt
	vbox.add_child(rich_text)

	var label := Label.new()
	label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	if wasBought:
		label.text = onSaleSentence
	else:
		label.text = "Comprar"
	vbox.add_child(label)

	var texture_rect := TextureRect.new()
	texture_rect.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	texture_rect.stretch_mode =TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	texture_rect.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	texture_rect.size_flags_vertical = Control.SIZE_FILL
	texture_rect.visible = true
	texture_rect.modulate = color
	texture_rect.custom_minimum_size.x = 200
	if(item.type == "skin"):
		match item.skinOf:
			"roof":
				texture_rect.texture = UTILS.crop_texture(
					texture,460,600,220,220
				)
			"wall":
				texture_rect.texture = UTILS.crop_texture(
					texture,850,50,110,110
				)
			"floor":
				texture_rect.texture = texture
	else:
		texture_rect.texture = texture
	
	if not wasBought: button.button_up.connect(
		func():
		var res = StoreManager.buyItem(itemId)
		if res.noMoney:
			print("no mony")
		elif res.wasBought:
			print("ya comprao")
		else:
			#Animacion de compra y demás
			label.text = onSaleSentence
			button.disabled = true
		drawItems()
	)
	
	hbox.add_child(texture_rect)
	button.add_child(hbox)
	return button
#endregion

#region Signals
func _on_close_btn_button_up() -> void:
	GameStateManager.change_state(GameStateManager.GameState.PLAY)
#endregion
