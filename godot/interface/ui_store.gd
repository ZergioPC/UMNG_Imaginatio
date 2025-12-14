extends Control

@onready var container:GridContainer = $MarginContainer/VBoxContainer/ScrollContainer/MarginContainer/GridItems

func _ready() -> void:
	drawItems()

func drawItems() -> void:
	deleteChildrens()
	
	for item in StoreManager.ITEMS:
		var btn:Button = Button.new()
		btn.custom_minimum_size = Vector2i(200,200)
		btn.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		
		var rect:TextureRect = TextureRect.new()
		rect.texture = item.texture
		rect.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
		rect.stretch_mode =TextureRect.STRETCH_KEEP_ASPECT_CENTERED
		rect.set_anchors_preset(PRESET_FULL_RECT)
		rect.visible = true
		
		btn.button_up.connect(
			func():
			var res = StoreManager.buyItem(item["id"])
			if res[0]:
				print("no mony")
			elif res[1]:
				print("ya comprao")
			else:
				#Animacion de compra y demás
				print("comprado ",item["id"])
			drawItems()
			)
		
		btn.add_child(rect)
		container.add_child(btn)

func deleteChildrens():
	if (container.get_child_count() > 0):
		for child in container.get_children():
			child.queue_free()

# Signals
func _on_close_btn_button_up() -> void:
	GameStateManager.change_state(GameStateManager.GameState.PLAY)
