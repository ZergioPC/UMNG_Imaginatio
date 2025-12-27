# Stage 1: Export the Godot project
FROM barichello/godot-ci:4.3 AS exporter

WORKDIR /app

# Copy the Godot project files
COPY . .

# Create export directory
RUN mkdir -p /app/export

# Export the project for Web (HTML5)
# Make sure you have an export_presets.cfg in your project
RUN godot --headless --export-release "WebImaginatio" /app/export/index.html

# Stage 2: Serve the exported game
FROM nginx:alpine

# Copy the exported files from the exporter stage
COPY --from=exporter /app/export /usr/share/nginx/html

# Copy custom nginx configuration (optional)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]