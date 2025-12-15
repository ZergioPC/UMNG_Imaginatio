# GameStateManager.gd
extends Node

enum GameState {
	PLAY,
	MESSAGE,
	EDIT,
	SHOP,
	FEEDING,
	PETTING
}
var current_state: GameState = GameState.PLAY
signal state_changed(new_state: GameState)

signal display_dialog
signal display_nameForm

func _ready() -> void:
	StoreManager.loadItems()
	SaveDataManager.onLoad()
	
	connect("state_changed", PropsManager._on_state_changed)

#region GameStateChanger
func change_state(new_state: GameState) -> void:
	if current_state == new_state:
		return
	
	# Exit current state
	_exit_state(current_state)
	
	# Change state
	current_state = new_state
	
	# Enter new state
	_enter_state(new_state)
	
	emit_signal("state_changed", new_state)

func _exit_state(state: GameState) -> void:
	match state:
		GameState.PLAY:
			# Clean up mini-game, hide game UI
			pass
		GameState.EDIT:
			# Save house changes, hide customization UI
			pass

func _enter_state(state: GameState) -> void:
	match state:
		GameState.PLAY:
			print("Modo edicion desactivado")
			pass
		GameState.EDIT:
			print("Modo edicion activado")
			# Show furniture catalog, enable placement mode
			pass
		GameState.SHOP:
			print("Modo shopping activado")
			# Show furniture catalog, enable placement mode
			pass
		GameState.MESSAGE:
			print("Modo message activado")
			# Show furniture catalog, enable placement mode
			pass
#endregion
