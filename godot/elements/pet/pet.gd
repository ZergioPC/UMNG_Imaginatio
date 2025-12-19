extends Node3D

# Animation
@onready var anim_tree: AnimationTree = $AnimationTree
@onready var state_machine: AnimationNodeStateMachinePlayback = anim_tree.get("parameters/playback")

func _ready():
	state_machine.travel("idle")
	
	# Add this node to the "pet" group so InputManager can identify it
	add_to_group("pet")

# This method is called by InputManager when petting is detected
func on_dog_petted():
	print("Dog petted! Good boy!")
	state_machine.travel("pet")
	await get_tree().create_timer(0.2).timeout

# This method is called by InputManager when petting ends
func check_petting_complete():
	state_machine.travel("idle")
	print("end")
