from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from router import auth, posts, equipo, events

app = FastAPI()

# Routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(posts.router, prefix="/post", tags=["post"])
app.include_router(events.router, prefix="/event", tags=["event"])
app.include_router(equipo.router, prefix="/equipo", tags=["equipo"])

#Main
@app.get("/")
async def home():
    return {"message":"Hola Puto"}