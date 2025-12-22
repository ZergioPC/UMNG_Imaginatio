shader_type canvas_item;

// --- Toggles ---
uniform bool enable_pixelation = true;
uniform bool enable_grayscale = true;
uniform bool enable_palette = false;

// --- Controls ---
uniform float pixel_size = 3.0;

// NES-like palette (simplified)
const vec3 NES_PALETTE[8] = vec3[](
    vec3(0.0, 0.0, 0.0),        // black
    vec3(0.5, 0.5, 0.5),        // gray
    vec3(1.0, 1.0, 1.0),        // white
    vec3(0.55, 0.15, 0.15),     // dark red
    vec3(0.9, 0.3, 0.3),        // red
    vec3(0.2, 0.4, 0.8),        // blue
    vec3(0.3, 0.7, 0.3),        // green
    vec3(0.9, 0.8, 0.3)         // yellow
);

vec3 closest_palette_color(vec3 color) {
    float min_dist = 999.0;
    vec3 best = color;

    for (int i = 0; i < 8; i++) {
        float dist = distance(color, NES_PALETTE[i]);
        if (dist < min_dist) {
            min_dist = dist;
            best = NES_PALETTE[i];
        }
    }
    return best;
}

void fragment() {
    vec2 uv = UV;

    // Pixelation
    if (enable_pixelation) {
        uv = floor(uv / (pixel_size * TEXTURE_PIXEL_SIZE))
           * (pixel_size * TEXTURE_PIXEL_SIZE);
    }

    vec4 tex = texture(TEXTURE, uv);
    vec3 color = tex.rgb;

    // Grayscale
    if (enable_grayscale) {
        float gray = dot(color, vec3(0.299, 0.587, 0.114));
        color = vec3(gray);
    }

    // NES palette limit
    if (enable_palette) {
        color = closest_palette_color(color);
    }

    COLOR = vec4(color, tex.a);
}
