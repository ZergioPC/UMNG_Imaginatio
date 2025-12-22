extends Node

func crop_texture(
	original_texture: Texture2D,
	x: int,
	y: int,
	width: int,
	height: int
) -> Texture2D:
	var src_image: Image = original_texture.get_image()

	# Clamp to avoid out-of-bounds (important)
	width = min(width, src_image.get_width() - x)
	height = min(height, src_image.get_height() - y)

	var dst_image:Image = Image.create_empty(width, height, false, src_image.get_format())
	dst_image.blit_rect(
		src_image,
		Rect2i(x, y, width, height),
		Vector2i(0, 0)
	)
	dst_image.rotate_90(CLOCKWISE)
	
	return ImageTexture.create_from_image(dst_image)
