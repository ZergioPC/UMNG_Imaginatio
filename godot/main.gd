extends Node3D

# UI's
@onready var UiNormal:Control = $UI/NormalUI
@onready var UiEdit:Control = $UI/EditUI
@onready var menuDialog:Control = $Menus/Dialog
@onready var menuStore:Control = $Menus/StoreUI

# ELEMENTS
@onready var Pet:Node3D = $Pet
@onready var Bowl:Node3D = $Pet_Bowl

const pet_show_pos:Vector3 = Vector3(0.0, 0.0, 0.32)
const pet_hide_pos:Vector3 = Vector3(0.0, -2.0, 0.32)

func _ready() -> void:
	
	UserManager.initHouseMaterials()
	UserManager.emitNewMoney(UserManager.MONEY)
	UserManager.emitNewName(UserManager.PET_NAME)
	
	# UI settings
	UiEdit.visible = false
	UiNormal.visible = true
	menuDialog.visible = false
	menuStore.visible = false
	
	# Elements Settings
	Pet.visible = true
	Pet.global_position = pet_show_pos
	Bowl.visible = true
	
	# Game Settings
	PropsManager.loadProps()
	PropsManager.setPropsNode($Props)
	GameStateManager.connect("state_changed", _on_state_changed)
	
	if SaveDataManager.firstTime:
		GameStateManager.change_state(GameStateManager.GameState.MESSAGE)
		GameStateManager.display_nameForm.emit()

func _process(_delta: float) -> void:
	pass

func _on_state_changed(new_state):
	match new_state:
		GameStateManager.GameState.PLAY:
			UiEdit.visible = false
			UiNormal.visible = true
			menuStore.visible = false
			menuDialog.visible = false
			
			Pet.visible = true
			Pet.global_position = pet_show_pos
			
			Bowl.visible = true
		GameStateManager.GameState.EDIT:
			UiEdit.visible = true
			UiNormal.visible = false
			menuStore.visible = false
			menuDialog.visible = false
			
			Pet.visible = false
			Pet.global_position = pet_hide_pos
			Bowl.visible = false
		GameStateManager.GameState.SHOP:
			UiEdit.visible = false
			UiNormal.visible = false
			menuDialog.visible = false
			menuStore.visible = true
			
			Pet.visible = true
			Pet.global_position = pet_show_pos
			
			Bowl.visible = true
		GameStateManager.GameState.MESSAGE:
			UiEdit.visible = false
			UiNormal.visible = false
			menuStore.visible = false
			menuDialog.visible = true
			
			Pet.visible = true
			Pet.global_position = pet_show_pos
			
			Bowl.visible = true
