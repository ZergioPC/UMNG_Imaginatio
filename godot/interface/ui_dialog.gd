extends Control

@onready var MarginForm := $CenterContainer/MarginFormName
@onready var TextForm := $CenterContainer/MarginFormName/formName/FormNameText

@onready var MarginDialog := $CenterContainer/MarginDialog

func _ready() -> void:
	MarginForm.visible = false
	MarginDialog.visible = false
	
	GameStateManager.display_nameForm.connect(onFormNameShow)
	GameStateManager.display_dialog.connect(onDialogShow)

# SIGNALS

func onDialogShow():
	MarginDialog.visible = true
	
func onFormNameShow():
	MarginForm.visible = true

func _on_form_name_btn_button_up() -> void:
	UserManager.emitNewName(TextForm.text)
	MarginForm.visible = false
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

func _on_dialog_btn_button_up() -> void:
	MarginDialog.visible = false
	GameStateManager.change_state(GameStateManager.GameState.PLAY)
