import os, random
from fastapi import APIRouter, status, Depends, HTTPException, Form, File, UploadFile

from models.torneo.futbolProfesor import FutbolProfesor
from models.torneo.futbolTeam import FutbolTeam

from db import select, db_commit, db_delete_unique, db_select_query, db_select_unique, db_update
from auth.depends import get_current_admin
from utils import IMG_PATH_TORNEO, IMG_PATH

from router.torneo.utils import aux_name_formater

router = APIRouter()

@router.get("/get")
async def get_data():
    query = select(FutbolProfesor)
    profes = await db_select_query(query)
    return {"data":profes,"message":"Lista de Profesores"}

@router.post("/crear", status_code=status.HTTP_201_CREATED)
async def profe_crear(
    name: str = Form(...),
    img: UploadFile = File(...),
    admin:str = Depends(get_current_admin)
):  
    query = select(FutbolTeam).where(FutbolTeam.hasProfesor == False)
    try:
        teams_disponibles = await db_select_query(query)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No hay equipos disponibles"
        )
    equipo_id = random.choice(teams_disponibles).id
    
    if not img.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid image type")

    contents = await img.read()

    # Save or process the image
    ext = img.content_type.split("/")[-1]
    filename = f"profe_{aux_name_formater(name)}_team_{equipo_id}.{ext}"

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

    current_team:FutbolTeam = await db_select_unique(FutbolTeam,equipo_id)
    current_team_data = current_team.model_dump()
    current_team_data["hasProfesor"] = True
    await db_update(FutbolTeam, equipo_id, current_team_data)

    return {"message": "Profesor creado con éxito"}  

@router.delete("/delete/{id}", status_code=status.HTTP_403_FORBIDDEN)
async def borrar(id:int, admin:str=Depends(get_current_admin)):
    profe:FutbolProfesor = await db_select_unique(FutbolProfesor, id)
    if profe.img_url and os.path.exists(profe.img_url[1:]):
        os.remove(profe.img_url[1:])
    
    await db_delete_unique(FutbolProfesor,id)
    return {"message":"Profe eliminado con Exito"}