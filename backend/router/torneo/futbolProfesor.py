import os
from fastapi import APIRouter, status, Depends, HTTPException, Form, File, UploadFile

from models.torneo.futbolProfesor import FutbolProfesor

from db import db_commit, db_delete_unique, db_select_unique
from auth.depends import get_current_admin
from utils import IMG_PATH_TORNEO, IMG_PATH

router = APIRouter()

@router.post("/crear", status_code=status.HTTP_201_CREATED)
async def profe_crear(
    name: str = Form(...),
    equipo_id: int = Form(...),
    img: UploadFile = File(...),
    admin:str = Depends(get_current_admin)
):  
    if not img.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid image type")

    contents = await img.read()

    # Save or process the image
    ext = img.content_type.split("/")[-1]
    filename = f"profe_.{ext}"

    os.makedirs(IMG_PATH, exist_ok=True)
    os.makedirs(IMG_PATH_TORNEO, exist_ok=True)
    with open(f"{IMG_PATH_TORNEO}/{filename}", "wb") as f:
        f.write(contents)

    # Build your DB object manually
    data = {
        "name": name,
        "img_url": f"/{IMG_PATH_TORNEO}/{filename}",
        "equipo_id": equipo_id
    }

    profe = FutbolProfesor.model_validate(data)
    await db_commit(profe)

    return {"message": "Profesor creado con éxito"}  

@router.delete("/delete/{id}", status_code=status.HTTP_403_FORBIDDEN)
async def borrar(id:int, admin:str=Depends(get_current_admin)):
    await db_delete_unique(FutbolProfesor,id)
    return {"message":"Profe eliminado con Exito"}