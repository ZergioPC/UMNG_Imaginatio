import os , logging
from dotenv import load_dotenv
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from db import crear_tablas
from auth import router as auth
from router import posts, equipo, events, estudiantes, muestra_academica, utils
from router.torneo import fase, futbolPlayer, futbolProfesor, futbolTeam, partido
from router.torneo import utils as torneoUtils
from utils import IMG_PATH, IMG_PATH_POSTS, IMG_PATH_USERS, IMG_PATH_TORNEO, IMG_PATH_MUESTRAS


load_dotenv()
STORAGE_NAME:str = os.getenv("LOCALSTORAGE")

async def lifespan(app: FastAPI):
    # Startup
    async for _ in crear_tablas(app):
        pass
    yield
    # Shutd

# Dev Docs allow (esto hace que las fotos no carguen correctamente)
# app = FastAPI(root_path="/api",lifespan=lifespan)

# Production
app = FastAPI(
    lifespan=lifespan,
    docs_url=None, 
    redoc_url=None
    )

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "").split(",")

logging.warning (ALLOWED_ORIGINS)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["*"]
)

# Static Files
os.makedirs(IMG_PATH, exist_ok=True)
os.makedirs(IMG_PATH_USERS, exist_ok=True)
os.makedirs(IMG_PATH_POSTS, exist_ok=True)
os.makedirs(IMG_PATH_TORNEO, exist_ok=True)
os.makedirs(IMG_PATH_MUESTRAS, exist_ok=True)
app.mount("/uploads",StaticFiles(directory="uploads"), name="uploads")

# Routers
app.include_router(utils.router, prefix="/utils", tags=["utils"])
app.include_router(posts.router, prefix="/post", tags=["post"])
app.include_router(events.router, prefix="/event", tags=["event"])
app.include_router(equipo.router, prefix="/equipo", tags=["equipo"])
app.include_router(estudiantes.router, prefix="/estudiantes", tags=["estudiantes"])
app.include_router(muestra_academica.router, prefix="/muestra", tags=["muestra"])

app.include_router(auth.router, prefix="/auth", tags=["auth"])

app.include_router(fase.router, prefix="/torneo_fase", tags=["Torneo Fase"])
app.include_router(partido.router, prefix="/torneo_partido", tags=["Torneo Partido"])
app.include_router(futbolTeam.router, prefix="/torneo_team", tags=["Torneo Team"])
app.include_router(futbolPlayer.router, prefix="/torneo_players", tags=["Torneo Players"])
app.include_router(futbolProfesor.router, prefix="/torneo_profe", tags=["Torneo Profe"])
app.include_router(torneoUtils.router, prefix="/torneo_utils", tags=["Torneo Utils"])

# Main
@app.get("/health")
async def health():
    return {"message": "Hola"}

@app.get("/storage_item")
async def storageName():
    return {"message": STORAGE_NAME}