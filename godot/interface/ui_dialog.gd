extends Control

@onready var MarginDialog := $CenterContainer/MarginDialog
@onready var MarginForm := $CenterContainer/MarginFormName
@onready var TextForm:LineEdit = $CenterContainer/MarginFormName/formName/FormNameText
@onready var ScrollHelp:ScrollContainer = $CenterContainer/ScrollHelpContainer
@onready var PopUp:AcceptDialog = $CenterContainer/AcceptDialog

func _ready() -> void:
	MarginForm.visible = false
	MarginDialog.visible = false
	ScrollHelp.visible = false
	PopUp.visible = false
	
	GameStateManager.display_nameForm.connect(onFormNameShow)
	GameStateManager.display_dialog.connect(onDialogShow)
	GameStateManager.display_manual.connect(onHelpShow)
	GameStateManager.display_pop.connect(showAlert)

func showAlert(message: String, title: String) -> void:
	PopUp.title = title
	PopUp.dialog_text = message
	PopUp.popup_centered()

# SIGNALS

func onDialogShow():
	MarginDialog.visible = true
	
func onFormNameShow():
	MarginForm.visible = true

func onHelpShow():
	ScrollHelp.visible = true

func _on_form_name_btn_button_up() -> void:
	if (TextForm.text.is_empty()):
		showAlert("Debes darle un nombre a tu mascota","Alerta!")
		return
	
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

func _on_help_ok_btn_button_up() -> void:
	ScrollHelp.visible = true
	GameStateManager.change_state(GameStateManager.GameState.PLAY)
