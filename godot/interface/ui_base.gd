extends Control

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	pass # Replace with function body.

#region SIGNALS - UI BTNs
func _on_edit_btn_button_up() -> void:
	GameStateManager.change_state(GameStateManager.GameState.EDIT)
	
func _on_store_btn_button_up() -> void:
	GameStateManager.change_state(GameStateManager.GameState.SHOP)

#endregion
