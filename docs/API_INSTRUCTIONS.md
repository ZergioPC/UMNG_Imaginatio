# Guía de la API de Imaginatio para el Frontend

¡Hola! Esta guía te ayudará a comunicarte con el backend de Imaginatio. Aquí encontrarás información sobre cómo autenticarte y usar los diferentes endpoints disponibles.

## URL Base

La URL base para todas las llamadas a la API es:

```
http://localhost:8000
```

## Autenticación

La API utiliza un sistema de autenticación basado en cookies para gestionar las sesiones. Hay dos tipos de usuarios: **equipos** (usuarios normales) y **administradores**.

### Autenticación de Equipos

Para autenticarte como un equipo, debes enviar una solicitud `POST` al endpoint `/auth/login`.

- **Endpoint:** `POST /auth/login`
- **Request Body:**
  ```json
  {
    "name": "nombre_del_equipo",
    "password": "tu_contraseña"
  }
  ```
- **Respuesta Exitosa:**
  ```json
  {
    "message": "Login exitoso",
    "user": "nombre_del_equipo"
  }
  ```

Si las credenciales son correctas, el backend establecerá una cookie `httponly` llamada `imaginatio_session` en tu navegador. Esta cookie se enviará automáticamente en todas las solicitudes posteriores, permitiéndote acceder a los endpoints protegidos.

### Autenticación de Administradores

Para autenticarte como administrador, el proceso es similar.

- **Endpoint:** `POST /auth/admin`
- **Request Body:**
  ```json
  {
    "name": "admin_user",
    "password": "admin_password"
  }
  ```
- **Respuesta Exitosa:**
  ```json
  {
    "message": "Login de Admin exitoso",
    "user": "Admin"
  }
  ```

Si las credenciales son correctas, el backend establecerá una cookie `httponly` llamada `imaginatio_admin`. Esta cookie te dará acceso a los endpoints exclusivos para administradores.

## Endpoints

A continuación se detallan los endpoints disponibles, agrupados por recurso.

---

### Posts (`/post`)

#### Obtener un Post

- **Endpoint:** `GET /post/get/{id}`
- **Descripción:** Obtiene la información de un post específico.
- **Autenticación:** Ninguna.

#### Obtener Posts por Página

- **Endpoint:** `GET /post/pages/{pag}`
- **Descripción:** Obtiene una lista de 15 posts por página. Reemplaza `{pag}` con el número de página que deseas (empezando desde 0).
- **Autenticación:** Ninguna.

#### Dar "Like" a un Post

- **Endpoint:** `PATCH /post/like/{id}`
- **Descripción:** Incrementa en uno el contador de "likes" de un post.
- **Autenticación:** Ninguna.

#### Eliminar un Post (como Equipo)

- **Endpoint:** `DELETE /post/delete/{id}`
- **Descripción:** Elimina un post que le pertenece al equipo autenticado.
- **Autenticación:** Requiere sesión de equipo (`imaginatio_session`).

#### Eliminar un Post (como Admin)

- **Endpoint:** `DELETE /post/delete-by-admin/{id}`
- **Descripción:** Elimina cualquier post.
- **Autenticación:** Requiere sesión de administrador (`imaginatio_admin`).

---

### Equipos (`/equipo`)

#### Crear un Equipo

- **Endpoint:** `POST /equipo/crear`
- **Descripción:** Crea un nuevo equipo.
- **Autenticación:** Requiere sesión de administrador (`imaginatio_admin`).
- **Request Body:**
  ```json
  {
    "name": "nombre_del_equipo",
    "desc": "Descripción del equipo",
    "equipo_password": "contraseña_del_equipo",
    "evento_id": 1
  }
  ```

#### Editar un Equipo

- **Endpoint:** `PATCH /equipo/editar/{id}`
- **Descripción:** Edita la información de un equipo. Un equipo solo puede editar su propio perfil.
- **Autenticación:** Requiere sesión de equipo (`imaginatio_session`).
- **Request Body (solo incluye los campos a modificar):**
  ```json
  {
    "name": "nuevo_nombre",
    "desc": "nueva_descripción"
  }
  ```

#### Eliminar un Equipo

- **Endpoint:** `DELETE /equipo/delete/{id}`
- **Descripción:** Elimina un equipo.
- **Autenticación:** Requiere sesión de administrador (`imaginatio_admin`).

#### Obtener Información de un Equipo

- **Endpoint:** `GET /equipo/get/{id}`
- **Descripción:** Obtiene la información pública de un equipo.
- **Autenticación:** Ninguna.

#### Filtrar Equipos por Evento

- **Endpoint:** `GET /equipo/filter/{evento_id}`
- **Descripción:** Obtiene una lista de todos los equipos que participan en un evento específico.
- **Autenticación:** Ninguna.

#### Publicar un Post

- **Endpoint:** `POST /equipo/publicar`
- **Descripción:** Crea un nuevo post a nombre del equipo autenticado.
- **Autenticación:** Requiere sesión de equipo (`imaginatio_session`).
- **Request Body:**
  ```json
  {
    "title": "Título del Post",
    "desc": "Descripción del post",
    "img": "URL_de_la_imagen.jpg",
    "equipo_id": 1
  }
  ```

#### Obtener Publicaciones de un Equipo

- **Endpoint:** `GET /equipo/publicaciones/{id}`
- **Descripción:** Obtiene todos los posts de un equipo específico.
- **Autenticación:** Ninguna.

---

### Estudiantes (`/equipo/estudiante`)

#### Crear un Estudiante

- **Endpoint:** `POST /equipo/estudiante/crear`
- **Descripción:** Añade un nuevo estudiante al equipo autenticado.
- **Autenticación:** Requiere sesión de equipo (`imaginatio_session`).
- **Request Body:**
  ```json
  {
    "name": "Nombre del Estudiante",
    "img": "URL_de_la_imagen.jpg",
    "codigo": "123456789",
    "desc": "Descripción del estudiante",
    "phone": "3001234567",
    "email": "estudiante@email.com",
    "instagram": "user",
    "twiter": "user",
    "tiktok": "user",
    "equipo_id": 1
  }
  ```

#### Editar un Estudiante

- **Endpoint:** `PATCH /equipo/estudiante/editar/{id}`
- **Descripción:** Edita la información de un estudiante que pertenece al equipo autenticado.
- **Autenticación:** Requiere sesión de equipo (`imaginatio_session`).
- **Request Body (solo incluye los campos a modificar):**
  ```json
  {
    "name": "Nuevo Nombre",
    "desc": "Nueva descripción"
  }
  ```

#### Eliminar un Estudiante

- **Endpoint:** `DELETE /equipo/estudiante/delete/{id}`
- **Descripción:** Elimina un estudiante que pertenece al equipo autenticado.
- **Autenticación:** Requiere sesión de equipo (`imaginatio_session`).

#### Filtrar Estudiantes por Equipo

- **Endpoint:** `GET /equipo/estudiante/filter/{equipo_id}`
- **Descripción:** Obtiene la lista de estudiantes de un equipo específico.
- **Autenticación:** Ninguna.

---

### Eventos (`/event`)

#### Obtener Todos los Eventos

- **Endpoint:** `GET /event/get`
- **Descripción:** Obtiene una lista de todos los eventos.
- **Autenticación:** Ninguna.

#### Obtener Información de un Evento

- **Endpoint:** `GET /event/get/{id}`
- **Descripción:** Obtiene la información de un evento específico.
- **Autenticación:** Ninguna.

#### Crear un Evento

- **Endpoint:** `POST /event/crear`
- **Descripción:** Crea un nuevo evento.
- **Autenticación:** Requiere sesión de administrador (`imaginatio_admin`).
- **Request Body:**
  ```json
  {
    "name": "Nombre del Evento",
    "desc": "Descripción del evento"
  }
  ```

#### Editar un Evento

- **Endpoint:** `PATCH /event/editar/{id}`
- **Descripción:** Edita la información de un evento.
- **Autenticación:** Requiere sesión de administrador (`imaginatio_admin`).
- **Request Body (solo incluye los campos a modificar):**
  ```json
  {
    "name": "Nuevo Nombre del Evento"
  }
  ```

#### Eliminar un Evento

- **Endpoint:** `DELETE /event/delete/{id}`
- **Descripción:** Elimina un evento.
- **Autenticación:** Requiere sesión de administrador (`imaginatio_admin`).

---

### Health Check

#### Comprobar Estado del Servidor

- **Endpoint:** `GET /health`
- **Descripción:** Un endpoint simple para verificar que el servidor está en funcionamiento.
- **Autenticación:** Ninguna.
- **Respuesta Exitosa:**
  ```json
  {
    "message": "Hola"
  }
  ```
