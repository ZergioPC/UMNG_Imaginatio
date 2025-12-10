extends Node3D

# UI's
@onready var UiNormal:Control = $UI/NormalUI
@onready var UiEdit:Control = $UI/EditUI
@onready var menuDialog:Control = $Menus/Dialog

# ELEMENTS
@onready var Pet:Node3D = $Pet
@onready var Bowl:Node3D = $Pet_Bowl

func _ready() -> void:
	# UI settings
	UiEdit.visible = false
	UiNormal.visible = true
	menuDialog.visible = false
	
	# Elements Settings
	Pet.visible = true
	Bowl.visible = true
	
	# Game Settings
	PropsManager.setPropsNode($Props)
	GameStateManager.connect("state_changed", _on_state_changed)

func _process(_delta: float) -> void:
	pass

func _on_state_changed(new_state):
	match new_state:
		GameStateManager.GameState.PLAY:
			UiEdit.visible = false
			UiNormal.visible = true
			
			Pet.visible = true
			Bowl.visible = true
		GameStateManager.GameState.EDIT:
			UiEdit.visible = true
			UiNormal.visible = false
			
			Pet.visible = false
			Bowl.visible = false
