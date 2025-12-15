extends Control

@onready var LabelName := $MarginContainer/VBoxContainer/NameLabel
@onready var LabelLikes := $MarginContainer/VBoxContainer/LikesLabel

func _ready() -> void:
	UserManager.change_name.connect(onChangeName)
	UserManager.change_money.connect(onChangeLikes)

#region SIGNALS - UI BTNs
func _on_edit_btn_button_up() -> void:
	GameStateManager.change_state(GameStateManager.GameState.EDIT)
	
func _on_store_btn_button_up() -> void:
	GameStateManager.change_state(GameStateManager.GameState.SHOP)
#endregion

#region SIGNALS - ChangeData
func onChangeName(newName:String):
	LabelName.text = newName

func onChangeLikes(newLikes:int):
	LabelLikes.text = str(newLikes)
#endregion
