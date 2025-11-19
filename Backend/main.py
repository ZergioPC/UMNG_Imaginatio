from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from db import crear_tablas
from auth import router as auth
from router import posts, equipo, events

app = FastAPI(lifespan=crear_tablas)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://127.0.0.1:8000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(posts.router, prefix="/post", tags=["post"])
app.include_router(events.router, prefix="/event", tags=["event"])
app.include_router(equipo.router, prefix="/equipo", tags=["equipo"])
app.include_router(auth.router, prefix="/auth", tags=["auth"])

#Main
@app.get("/health")
async def home():
    return {"message":"Hola"}