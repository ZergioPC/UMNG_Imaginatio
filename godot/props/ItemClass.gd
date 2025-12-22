extends StaticBody3D
class_name Item

const LIMITES = {
	"min": Vector3(-2.0, 0.0, -3.2),
	"max": Vector3(2.0, 0.0, 0.0)
}

# Item Values
var id: int
const resizeValue = 0.002
var itemSize: Vector3
var can_be_edited: bool = false

var collision_shape: CollisionShape3D
var sprite: Sprite3D

var itemStartPos: Vector3 = Vector3(0, 0, 0)

#region CONSTRUCTOR
# ===============================
# - - - - - CONSTRUCTOR - - - - -
# ===============================
func _init(item_id: int, size_array: Array, texture: Texture2D):
	var size = Vector3(size_array[0], size_array[1], size_array[2])
	
	id = item_id
	collision_shape = CollisionShape3D.new()
	sprite = Sprite3D.new()
	sprite.shaded = true
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
	add_to_group("prop")

func _ready():
	# Set initial visual state based on edit mode
	if can_be_edited:
		enable_editing()
	else:
		disable_editing()

func updatePos():
	itemStartPos = position

func updateInventoryItem():
	for item in InventoryManager.INVENTORY:
		if item["id"] == id:
			item["pos"] = position
#endregion

#region ENABLE/DISABLE EDITING
# ===============================
# - - - - - ENABLE DRAG - - - - -
# ===============================
func enable_editing():
	can_be_edited = true
	if sprite:
		sprite.modulate = Color(1, 1, 1, 0.5)

func disable_editing():
	can_be_edited = false
	if sprite:
		sprite.modulate = Color(1, 1, 1, 1)
#endregion
