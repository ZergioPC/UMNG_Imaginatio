extends Node

# Singleton for centralized input management
# Handles both item dragging and pet interactions

# ==============================
# DRAGGING SYSTEM
# ==============================
var is_dragging_item = false
var dragged_item: Item = null
var drag_start_pos: Vector2 = Vector2.ZERO
var item_start_pos: Vector3 = Vector3.ZERO

# ==============================
# PETTING SYSTEM
# ==============================
var is_petting = false
var petting_target: Node3D = null
var last_mouse_position: Vector2 = Vector2.ZERO
var pet_movements: Array = []
var pet_threshold: int = 3
var movement_sensitivity: float = 20.0
var time_window: float = 1.0

# ==============================
# CAMERA REFERENCE
# ==============================
var camera: Camera3D

func _ready():
	# Get camera reference
	await get_tree().process_frame
	camera = get_viewport().get_camera_3d()

# ==============================
# MAIN INPUT HANDLER
# ==============================
func _input(event):
	if not camera:
		camera = get_viewport().get_camera_3d()
		return
	
	# Handle mouse button events
	if event is InputEventMouseButton or event is InputEventScreenTouch:
		if event.pressed:
			_handle_press(event.position)
		else:
			_handle_release(event.position)
	
	# Handle mouse motion
	elif event is InputEventMouseMotion:
		_handle_motion(event.position)

#region handler system
# ==============================
# PRESS HANDLER
# ==============================
func _handle_press(mouse_pos: Vector2):
	var ray_result = raycast_from_mouse(mouse_pos)
	
	if not ray_result:
		return
	
	var collider = ray_result.collider
	
	# Priority 1: Check if we're clicking on an Item (only in EDIT mode)
	if GameStateManager.current_state == GameStateManager.GameState.EDIT:
		var item = _get_item_from_collider(collider)
		if item and item.can_be_edited:
			_start_dragging_item(item, mouse_pos)
			return
	
	# Priority 2: Check if we're clicking on the Pet
	if GameStateManager.current_state == GameStateManager.GameState.PLAY:
		var pet = _get_pet_from_collider(collider)
		if pet:
			_start_petting(pet, mouse_pos)

# ==============================
# RELEASE HANDLER
# ==============================
func _handle_release(_mouse_pos: Vector2):
	# Handle item drag end
	if is_dragging_item and dragged_item:
		_stop_dragging_item()
	
	# Handle petting end
	if is_petting and petting_target:
		_stop_petting()

# ==============================
# MOTION HANDLER
# ==============================
func _handle_motion(mouse_pos: Vector2):
	# Handle item dragging
	if is_dragging_item and dragged_item:
		_update_item_position(mouse_pos)
	
	# Handle petting motion
	elif is_petting and petting_target:
		_detect_petting_motion(mouse_pos)
#endregion

#region item dragging
# ==============================
# ITEM DRAGGING FUNCTIONS
# ==============================
func _start_dragging_item(item: Item, mouse_pos: Vector2):
	is_dragging_item = true
	dragged_item = item
	drag_start_pos = mouse_pos
	item_start_pos = item.global_position
	
	# Visual feedback
	if item.sprite:
		item.sprite.modulate = Color(1, 1, 1, 1)

func _update_item_position(mouse_pos: Vector2):
	if not dragged_item:
		return
	
	var smoothness = 0.005
	var item_size = dragged_item.itemSize
	
	dragged_item.global_position.x = clamp(
		item_start_pos.x - (drag_start_pos.x - mouse_pos.x) * smoothness,
		Item.LIMITES["min"].x + item_size.x * 0.43,
		Item.LIMITES["max"].x - item_size.x * 0.43
	)
	
	dragged_item.global_position.z = clamp(
		item_start_pos.z - (drag_start_pos.y - mouse_pos.y) * smoothness,
		Item.LIMITES["min"].z,
		Item.LIMITES["max"].z
	)

func _stop_dragging_item():
	if dragged_item:
		# Update item data
		dragged_item.updateInventoryItem()
		dragged_item.updatePos()
		
		# Visual feedback
		if dragged_item.sprite:
			dragged_item.sprite.modulate = Color(1, 1, 1, 0.5)
		
		dragged_item = null
	
	is_dragging_item = false
#endregion

#region pet functions
# ==============================
# PETTING FUNCTIONS
# ==============================
func _start_petting(pet: Node3D, mouse_pos: Vector2):
	is_petting = true
	petting_target = pet
	last_mouse_position = mouse_pos
	pet_movements.clear()

func _detect_petting_motion(current_position: Vector2):
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
			_trigger_pet_action()
			pet_movements.clear()
		
		last_mouse_position = current_position

func _stop_petting():
	if petting_target and petting_target.has_method("check_petting_complete"):
		petting_target.check_petting_complete()
	
	is_petting = false
	petting_target = null
	pet_movements.clear()

func _trigger_pet_action():
	if petting_target and petting_target.has_method("on_dog_petted"):
		petting_target.on_dog_petted()
#endregion

# ==============================
# HELPER FUNCTIONS
# ==============================
func raycast_from_mouse(mouse_pos: Vector2) -> Dictionary:
	if not camera:
		return {}
	
	var from = camera.project_ray_origin(mouse_pos)
	var to = from + camera.project_ray_normal(mouse_pos) * 1000
	
	var space_state = get_tree().root.get_world_3d().direct_space_state
	var query = PhysicsRayQueryParameters3D.create(from, to)
	
	var result = space_state.intersect_ray(query)
	return result

func _get_item_from_collider(collider: Node) -> Item:
	# Check if collider is an Item or child of an Item
	var node = collider
	while node:
		if node is Item:
			return node
		node = node.get_parent()
	return null

func _get_pet_from_collider(collider: Node) -> Node3D:
	# Check if collider is the pet or child of pet
	# Assuming pet has a specific name or is in a group
	var node = collider
	while node:
		# Check if node is in "pet" group or has specific script
		if node.is_in_group("pet"):
			return node
		node = node.get_parent()
	return null

# ==============================
# PUBLIC HELPER FUNCTIONS
# ==============================
func is_interacting() -> bool:
	return is_dragging_item or is_petting

func cancel_all_interactions():
	if is_dragging_item:
		_stop_dragging_item()
	if is_petting:
		_stop_petting()
