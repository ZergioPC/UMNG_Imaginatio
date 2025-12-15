extends Control

#region SIGNALS - BTN's

func _on_save_btn_button_up() -> void:
	PropsManager.updatePositions()
	PropsManager.drawProps()
	var data = SaveDataManager.formatData(
		UserManager.PET_NAME,
		UserManager.MONEY,
		InventoryManager.INVENTORY,
		UserManager.HOUSE_FLOOR,
		UserManager.HOUSE_ROOF,
		UserManager.HOUSE_WALL
	)
	SaveDataManager.saveData(data)
	GameStateManager.change_state(GameStateManager.GameState.PLAY)

#endregion
