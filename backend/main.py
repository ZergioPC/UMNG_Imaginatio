import os , logging
from dotenv import load_dotenv
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from db import crear_tablas
from auth import router as auth
from router import posts, equipo, events, estudiantes, utils
from utils import IMG_PATH, IMG_PATH_POSTS, IMG_PATH_USERS


load_dotenv()
STORAGE_NAME:str = os.getenv("LOCALSTORAGE")

async def lifespan(app: FastAPI):
    # Startup
    async for _ in crear_tablas(app):
        pass
    yield
    # Shutd

# Dev Docs allow
# app = FastAPI(lifespan=lifespan)

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
app.mount("/uploads",StaticFiles(directory="uploads"), name="Uploads")

# Routers
app.include_router(utils.router, prefix="/utils", tags=["utils"])
app.include_router(posts.router, prefix="/post", tags=["post"])
app.include_router(events.router, prefix="/event", tags=["event"])
app.include_router(equipo.router, prefix="/equipo", tags=["equipo"])
app.include_router(estudiantes.router, prefix="/estudiantes", tags=["estudiantes"])
app.include_router(auth.router, prefix="/auth", tags=["auth"])

#Main
@app.get("/health")
async def health():
    return {"message": "Hola"}

@app.get("/storage_item")
async def storageName():
    return {"message": STORAGE_NAME}