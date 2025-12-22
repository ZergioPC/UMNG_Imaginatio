extends Node3D

func _ready() -> void:
	UserManager.house_changeFloor.connect(_onChangeTextureFloor)
	UserManager.house_changeRoof.connect(_onChangeTextureRoof)
	UserManager.house_changeWall.connect(_onChangeTextureWall)

func createMaterial(image:Texture2D) -> StandardMaterial3D:
	var material:StandardMaterial3D = StandardMaterial3D.new()
	material.albedo_texture = image
	return material

func _onChangeTextureRoof(id:int, image:Texture2D):
	UserManager.HOUSE_ROOF = id
	$Techo.material_override = createMaterial(image)

func _onChangeTextureFloor(id:int, image:Texture2D):
	UserManager.HOUSE_FLOOR = id
	$Plane.material_override = createMaterial(image)

func _onChangeTextureWall(id:int, image:Texture2D):
	UserManager.HOUSE_WALL = id
	$Paredes.material_override = createMaterial(image)
