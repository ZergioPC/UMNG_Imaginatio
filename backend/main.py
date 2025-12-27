import os
from dotenv import load_dotenv
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from db import crear_tablas
from auth import router as auth
from router import posts, equipo, events, estudiantes


load_dotenv()
STORAGE_NAME:str = os.getenv("LOCALSTORAGE")

async def lifespan(app: FastAPI):
    # Startup
    async for _ in crear_tablas(app):
        pass
    yield
    # Shutd

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost",
        "http://localhost:80",
        "http://localhost:8080",
        "http://127.0.0.1",
        "http://127.0.0.1:80",
        "http://127.0.0.1:8080"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static Files
app.mount("/uploads",StaticFiles(directory="uploads"), name="Uploads")

# Routers
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