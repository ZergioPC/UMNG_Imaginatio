extends Node3D

# Animation
@onready var anim_tree: AnimationTree = $AnimationTree
@onready var state_machine: AnimationNodeStateMachinePlayback = anim_tree.get("parameters/playback")

# Particles
@onready var heartParticles:CPUParticles3D = $HeartCPUParticles
@onready var starsParticles:CPUParticles3D = $StarsCPUParticles

func _ready():
	starsParticles.emitting = false
	heartParticles.emitting = false
	state_machine.travel("idle")
	
	# Add this node to the "pet" group so InputManager can identify it
	add_to_group("pet")

# This method is called by InputManager when petting is detected
func on_dog_petted():
	state_machine.travel("pet")
	heartParticles.emitting = true
	await get_tree().create_timer(0.2).timeout

# This method is called by InputManager when petting ends
func check_petting_complete():
	heartParticles.emitting = false
	starsParticles.emitting = true
	state_machine.travel("idle")
