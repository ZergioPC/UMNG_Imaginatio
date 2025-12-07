# 🌌 Imaginatio Webapp 🎮

_**Proyecto final de Diseño II**_

Este proyecto busca la creación de una **Plataforma Comunitaria** mediante la cual se de gestión y promoción al **Imaginatio,** evento organizado por la carrera de **Ingeniería Multimedia** en la **Universidad Militar Nueva Granada.**

Es una red social donde los equipos del evento pueden realizar **publicaciones** de su progreso, a su vez que los espectadores pueden ver informacion acerca del evento y sus actividades.

Cuenta tambien con una **mascota,** minijuego que funciona a base de los _**me gusta**_ dados por el visitante a cada publicacion.

## Setup

### 1. Clonar el Repositorio

```bash
git clone https://github.com/ZergioPC/UMNG_Imaginatio.git
cd UMNG_Imaginatio
```

### 2. Opciones de Ejecución

Puedes ejecutar el proyecto de dos maneras:

#### A. Usando Docker (Recomendado)

Esta es la forma más sencilla de levantar todo el entorno.

**Requisitos:**
- [Docker](https://docs.docker.com/get-docker/)

**Ejecución:**

1.  Asegúrate de que Docker esté en ejecución.
2.  En la raíz del proyecto, ejecuta:

    ```bash
    docker compose up --build -d
    ```

    Esto iniciará:
    -   El **backend** en `http://localhost:8000`
    -   El **frontend** en `http://localhost:8080`

3.  Para detener los servicios, ejecuta: `docker compose down`.

#### B. Setup Manual

Si prefieres configurar cada parte por separado:

##### Backend

El backend está programado en **Python** con **FastAPI.** Para configurarlo correctamente, es recomendable usar un entorno virtual.

Primero, ubícate en la carpeta del backend:
```bash
cd ./backend
```

Crea un entorno virtual (si no existe ya):
```bash
python -m venv env
```

Activa el entorno virtual. El comando varía según tu sistema operativo:

**En Linux/macOS:**
```bash
source env/bin/activate
```

**En Windows:**
```bash
.\env\Scripts\activate
```

Una vez activado, instala las dependencias correspondientes:
```bash
pip install -r requirements.txt
```

Finalmente, ejecuta esta línea de código para que el servidor esté disponible de forma local:
```Python
uvicorn main:app --host 0.0.0.0 --port 8000
```
> Para desactivar el entorno virtual cuando termines, simplemente ejecuta `deactivate`.

**Base de datos:** La base de datos utilizada de momento es **SQLite,** manejada con **SQLModel.**

##### Frontend

El frontend está hecho en **HTML, CSS y JS** vanilla. Para visualizarlo, simplemente abre el archivo `index.html` en tu navegador. No es necesario levantar ningún servidor.

> `API` Es el _endpoint_ para comunicarse con el **Backend.** Puede ser modificado en el archivo `frontend/js/config.js`.

## Creditos

* Los iconos del frontend fueron obtenidos de [SVGRepo](www.svgrepo.com).
* Los assets de la mascota son de elaboracion propia
