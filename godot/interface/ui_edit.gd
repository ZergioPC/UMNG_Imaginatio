extends Control


# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(_delta: float) -> void:
	pass

#region SIGNALS - BTN's

func _on_save_btn_button_up() -> void:
	GameStateManager.change_state(GameStateManager.GameState.PLAY)

#endregion
