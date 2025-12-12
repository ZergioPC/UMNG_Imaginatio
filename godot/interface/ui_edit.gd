extends Control

#region SIGNALS - BTN's

func _on_save_btn_button_up() -> void:
	GameStateManager.change_state(GameStateManager.GameState.PLAY)

#endregion
