extends StaticBody3D
class_name Item

const LIMITES = {
	"min":Vector3(-2.0, 0.0,-3.2),
	"max":Vector3( 2.0, 0.0,-0.5)
}

# Item Values
var id:int
const resizeValue = 0.002
var itemSize:Vector3
var can_be_edited:bool = false

# Reference to the camera
@onready var camera = get_viewport().get_camera_3d()

var collision_shape: CollisionShape3D
var sprite: Sprite3D

# Dragging state
var is_dragging = false
var drag_offset = Vector3.ZERO
var y_position = 0.0

var startDragPos:Vector2 = Vector2(0,0)
var itemStartPos:Vector3 = Vector3(0,0,0)

#region CONSTRUCTOR
# ===============================
# - - - - - CONSTRUCTOR - - - - -
# ===============================
# Constructor: receives collision size (Vector3) and texture (Texture2D)
func _init(item_id:int, size: Vector3, texture: Texture2D):
	id = item_id
	collision_shape = CollisionShape3D.new()
	sprite = Sprite3D.new()
	itemSize = size * resizeValue
	can_be_edited = GameStateManager.current_state == GameStateManager.GameState.EDIT
	
	# Configure CollisionShape
	var box_shape := BoxShape3D.new()
	box_shape.size = Vector3(size.x * resizeValue, size.y * resizeValue, size.z)
	
	collision_shape.shape = box_shape
	collision_shape.position.y = 0.3
	add_child(collision_shape)

	# Configure Sprite3D
	sprite.texture = texture
	sprite.centered = true
	sprite.offset.y = 300
	sprite.scale *= 0.21
	
	itemStartPos = global_position
	add_child(sprite)
	
func updatePos():
	itemStartPos = position
	
func updateInventoryItem():
	for item in InventoryManager.INVENTORY:
		if item["id"] == id:
			item["pos"] = position
#endregion

#region DRAG ITEMS
# ==============================
# - - - - - DRAG ITEMS - - - - -
# ==============================

func _input(event):
	if (event is InputEventScreenTouch or event is InputEventMouseButton):
		if not can_be_edited: return
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
				startDragPos = event.position
				sprite.modulate = Color(1, 1, 1, 1)  # Full opacity
				start_dragging(ray_result.position)
		else:
			# Stop dragging
			updateInventoryItem()
			updatePos()
			sprite.modulate = Color(1, 1, 1, 0.5)  # Full opacity
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
	#print(hit_position)
	is_dragging = true
	y_position = global_position.y
	drag_offset = global_position - hit_position

func update_position(mouse_pos: Vector2):
	var smothness = 0.005
	global_position.x = clamp(
		itemStartPos.x - (startDragPos.x - mouse_pos.x) * smothness,
		LIMITES["min"].x + itemSize.x * 0.43,
		LIMITES["max"].x - itemSize.x * 0.43
	)
	global_position.z = clamp(
		itemStartPos.z - (startDragPos.y - mouse_pos.y) * smothness,
		LIMITES["min"].z, LIMITES["max"].z
	)
#endregion

#region ENABLE DRAG
# ===============================
# - - - - - ENABLE DRAG - - - - -
# ===============================
func enable_editing():
	can_be_edited = true
	sprite.modulate = Color(1, 1, 1, 0.5)  # Full opacity
	# Show delete button or highlight
	#$DeleteButton.visible = true

func disable_editing():
	can_be_edited = false
	is_dragging = false
	sprite.modulate = Color(1, 1, 1, 1)
	#$DeleteButton.visible = false
#endregion
