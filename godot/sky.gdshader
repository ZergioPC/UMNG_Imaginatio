shader_type sky;

uniform vec3 skyColor : source_color;
uniform vec3 horizontColor : source_color;

void sky() {
	float col = clamp(EYEDIR.y/0.6, 0.0, 1.0);
	vec3 finalColor = mix(horizontColor,skyColor,col);
	COLOR = finalColor;
}
