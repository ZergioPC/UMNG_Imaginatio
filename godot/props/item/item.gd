extends Node3D

const LIMITES = {
	"min":Vector3(-2.0, 0.0,-3.2),
	"max":Vector3( 2.0, 0.0,-1.0)
}

# Reference to the camera
@onready var camera = get_viewport().get_camera_3d()

var size:Vector3 = Vector3(2.0, 1.6, 1.0)

# Dragging state
var is_dragging = false
var drag_offset = Vector3.ZERO
var y_position = 0.0

var startDragPos:Vector2 = Vector2(0,0)
var itemStartPos:Vector3 = Vector3(0,0,0)

func _ready() -> void:
	itemStartPos = global_position
	
func _input(event):
	if event is InputEventMouseButton:
		if event.button_index == MOUSE_BUTTON_LEFT:
			if event.pressed:
				# Check if we clicked on this object
				var ray_result = raycast_from_mouse(event.position)
				startDragPos = event.position
				
				# Debug: Print what we hit
				#if ray_result:
					#print("Hit: ", ray_result.collider.name)
				#else:
					#print("Nothing hit")
				
				# Check if we hit this node or any of its children
				if ray_result and is_our_object(ray_result.collider):
					start_dragging(ray_result.position)
			else:
				# Stop dragging
				itemStartPos = global_position
				is_dragging = false
	
	elif event is InputEventMouseMotion and is_dragging:
		update_position(event.position)

func is_our_object(collider: Node) -> bool:
	# Check if the collider is this node or a child of this node
	# In case of be more deep in the tree node
	"""
	var node = collider
	while node:
		if node == self:
			return true
		node = node.get_parent()
	#return false
	"""
	return collider == self

func raycast_from_mouse(mouse_pos: Vector2) -> Dictionary:
	if not camera:
		print("No camera found!")
		return {}
	
	var from = camera.project_ray_origin(mouse_pos)
	var to = from + camera.project_ray_normal(mouse_pos) * 1000
	
	var space_state = get_world_3d().direct_space_state
	var query = PhysicsRayQueryParameters3D.create(from, to)
	
	# Make sure we're checking the right collision layers
	# By default, layer 1 is checked. Adjust if needed:
	# query.collision_mask = 1
	
	var result = space_state.intersect_ray(query)
	return result

func start_dragging(hit_position: Vector3):
	print(hit_position)
	is_dragging = true
	y_position = global_position.y
	drag_offset = global_position - hit_position

func update_position(mouse_pos: Vector2):
	var smothness = 0.005
	global_position.x = clamp(
		itemStartPos.x - (startDragPos.x - mouse_pos.x) * smothness,
		LIMITES["min"].x + size.x * 0.43,
		LIMITES["max"].x - size.x * 0.43
	)
	global_position.z = clamp(
		itemStartPos.z - (startDragPos.y - mouse_pos.y) * smothness,
		LIMITES["min"].z, LIMITES["max"].z
	)
	
	print(global_position)
