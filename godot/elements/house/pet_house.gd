extends Node3D

func _ready() -> void:
	UserManager.house_changeFloor.connect(_onChangeTextureFloor)
	UserManager.house_changeRoof.connect(_onChangeTextureRoof)
	UserManager.house_changeWall.connect(_onChangeTextureWall)

func createMaterial(image:Texture2D) -> StandardMaterial3D:
	var material:StandardMaterial3D = StandardMaterial3D.new()
	material.albedo_texture = image
	return material

func _onChangeTextureRoof(image:Texture2D):
	$Techo.material_override = createMaterial(image)
	print("Techo cambiado")

func _onChangeTextureFloor(image:Texture2D):
	$Plane.material_override = createMaterial(image)
	print("Suelo cambiado")

func _onChangeTextureWall(image:Texture2D):
	$Paredes.material_override = createMaterial(image)
	print("Paredes cambiado")
