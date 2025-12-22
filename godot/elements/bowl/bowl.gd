extends Node3D

@onready var like_tscn:PackedScene = preload("res://elements/like/Like.tscn")
@onready var likes_container:Node3D = $LikesNode

var radius := 3
var spacing := 0.35

func _ready() -> void:
	drawLikes(UserManager.MONEY)
	UserManager.change_money.connect(onLikesChange)
	
func onLikesChange(newValue):
	drawLikes(newValue)

func deleteChildrens():
	if (likes_container.get_child_count() > 0):
		for child in likes_container.get_children():
			child.queue_free()

func auxCalcHeight(x:int) -> int:
	return int((x-8)*2)

func drawLikes(n):
	randomize()
	deleteChildrens()
	
	var items_placed = 0
	var y = 0
	
	while items_placed < n:
		var layer_radius = radius - y * 0.3
		
		for x in range(-layer_radius, layer_radius):
			if items_placed >= n:
				break
				
			for z in range(-layer_radius, layer_radius):
				if items_placed >= n:
					break
					
				if Vector2(x, z).length() <= layer_radius:
					var cookie = like_tscn.instantiate()
					likes_container.add_child(cookie)
					cookie.position = Vector3(
						(x * spacing + randf_range(-0.05, 0.05)) * 0.1,
						(y * spacing * 0.1) + 0.1,
						(z * spacing + randf_range(-0.05, 0.05)) * 0.1
					)
					cookie.rotation = Vector3(
						randf_range(0, TAU),
						randf_range(0, TAU),
						randf_range(0, TAU)
					)
					items_placed += 1
		
		y += 1
		
		# Safety check to prevent infinite loop
		if y > 100:
			break
