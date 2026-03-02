import os, logging, random
from fastapi import APIRouter, status, Depends, HTTPException, Form, File, UploadFile
from sqlalchemy import func

from models.torneo.futbolPlayer import FutbolPlayer
from models.torneo.futbolTeam import FutbolTeam

from db import select, db_commit, db_delete_unique, db_select_unique, db_select_query, db_update
from auth.depends import get_current_admin
from utils import IMG_PATH_TORNEO, IMG_PATH

from router.torneo.utils import aux_name_formater

async def process_player(
    count:int,
    team_id: int,
    name: str,
    photo: UploadFile
) -> FutbolPlayer:

    if not photo.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail=f"{name}: Invalid image type"
        )

    contents = await photo.read()
    ext = photo.content_type.split("/")[-1]

    formatted_name = aux_name_formater(name)
    filename = f"team_{team_id}_est_{count}_{formatted_name}.{ext}"
    filepath = os.path.join(IMG_PATH_TORNEO, filename)

    with open(filepath, "wb") as f:
        f.write(contents)

    player_data = {
        "name": name,
        "img_url": f"/{IMG_PATH_TORNEO}/{filename}",
        "equipo_id": team_id
    }

    return FutbolPlayer.model_validate(player_data)

router = APIRouter()

@router.post("/crear", status_code=status.HTTP_201_CREATED)
async def crear_equipo(
    user1_name: str = Form(...),
    user1_photo: UploadFile = File(...),

    user2_name: str = Form(...),
    user2_photo: UploadFile = File(...),

    user3_name: str = Form(...),
    user3_photo: UploadFile = File(...),

    user4_name: str = Form(...),
    user4_photo: UploadFile = File(...),

    user5_name: str = Form(...),
    user5_photo: UploadFile = File(...),

    user6_name: str = Form(...),
    user6_photo: UploadFile = File(...),
):  
    query = select(FutbolTeam).where(FutbolTeam.fulled == False)
    try:
        teams_disponibles = await db_select_query(query)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No hay equipos disponibles"
        )
    team_id = random.choice(teams_disponibles).id
    
    players_input = [
        (user1_name, user1_photo),
        (user2_name, user2_photo),
        (user3_name, user3_photo),
        (user4_name, user4_photo),
        (user5_name, user5_photo),
        (user6_name, user6_photo),
    ]

    os.makedirs(IMG_PATH, exist_ok=True)
    os.makedirs(IMG_PATH_TORNEO, exist_ok=True)

    players = []

    for name, photo in players_input:
        player = await process_player(len(players),team_id, name, photo)
        players.append(player)

    for player in players:
        await db_commit(player)

    current_team:FutbolTeam = await db_select_unique(FutbolTeam,team_id)
    current_team_data = current_team.model_dump()
    current_team_data["fulled"] = True
    await db_update(FutbolTeam, team_id, current_team_data)

    return {
        "message": "Jugadores agregados creado con éxito",
        "asigned": current_team.name
    }  

@router.delete("/delete/{id}", status_code=status.HTTP_200_OK)
async def borrar(id:int, admin:str=Depends(get_current_admin)):
    query = select(FutbolPlayer).where(FutbolPlayer.equipo_id == id)
    data = await db_select_query(query)
    for player in data:
        await db_delete_unique(FutbolPlayer,player.id)

    return {"message":"Jugadores eliminado con Exito"}