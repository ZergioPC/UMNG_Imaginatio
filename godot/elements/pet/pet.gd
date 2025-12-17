extends Node3D

# Petting detection variables
var is_mouse_over = false
var is_petting = false
var last_mouse_position = Vector2.ZERO
var pet_movements = []
var pet_threshold = 3  # Number of up-down movements to register as petting
var movement_sensitivity = 20  # Minimum pixels to count as movement
var time_window = 1.0  # Time window to detect petting pattern (seconds)

# Visual feedback

func _ready():
	# Make sure the sprite can receive input
	set_process_input(true)

func _input(event):
	if event is InputEventMouseButton:
		if event.button_index == MOUSE_BUTTON_LEFT:
			if event.pressed and is_mouse_over:
				# Start petting
				is_petting = true
				last_mouse_position = event.position
				pet_movements.clear()
			else:
				# Stop petting
				if is_petting:
					check_petting_complete()
				is_petting = false
				pet_movements.clear()
	
	elif event is InputEventMouseMotion and is_petting:
		detect_petting_motion(event.position)

func detect_petting_motion(current_position):
	var delta_y = current_position.y - last_mouse_position.y
	
	# Check if movement is significant enough
	if abs(delta_y) > movement_sensitivity:
		var direction = 1 if delta_y > 0 else -1
		var current_time = Time.get_ticks_msec() / 1000.0
		
		# Add movement with timestamp
		pet_movements.append({"direction": direction, "time": current_time})
		
		# Remove old movements outside time window
		var cutoff_time = current_time - time_window
		pet_movements = pet_movements.filter(func(m): return m.time > cutoff_time)
		
		# Check for alternating up-down pattern
		if pet_movements.size() > pet_threshold:
			on_dog_petted()
			pet_movements.clear()
		
		last_mouse_position = current_position

func check_petting_complete():
	# Called when mouse button is released
	print("end")

func on_dog_petted():
	# Visual feedback
	print("Dog petted! Good boy!")
	await get_tree().create_timer(0.2).timeout
	
	# You can add more feedback here:
	# - Play sound effect
	# - Show particles
	# - Animate the sprite
	# - Increase affection meter
	# etc.

# Detect when mouse enters/exits the sprite area
func _on_mouse_entered():
	is_mouse_over = true

func _on_mouse_exited():
	is_mouse_over = false

# Note: For mouse enter/exit detection, you need to add an Area3D as a child
# of this Sprite3D with a CollisionShape3D. Connect the Area3D's 
# mouse_entered and mouse_exited signals to this script's functions above.
