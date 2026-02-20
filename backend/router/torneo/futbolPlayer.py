import os, logging, random
from fastapi import APIRouter, status, Depends, HTTPException, Form, File, UploadFile
from sqlalchemy import func

from models.torneo.futbolPlayer import FutbolPlayer
from models.torneo.futbolTeam import FutbolTeam

from db import select, db_commit, db_delete_unique, db_select_unique, db_select_query, db_update
from auth.depends import get_current_admin
from utils import IMG_PATH_TORNEO, IMG_PATH

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
    
    if not user1_photo.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="user1 Invalid image type")
    if not user2_photo.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="user2 Invalid image type")
    if not user3_photo.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="user3 Invalid image type")
    if not user4_photo.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="user4 Invalid image type")
    if not user5_photo.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="user5 Invalid image type")
    if not user6_photo.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="user5 Invalid image type")

    img1_contents = await user1_photo.read()
    img2_contents = await user2_photo.read()
    img3_contents = await user3_photo.read()
    img4_contents = await user4_photo.read()
    img5_contents = await user5_photo.read()
    img6_contents = await user5_photo.read()

    # Save or process the image
    ext1 = user1_photo.content_type.split("/")[-1]
    ext2 = user2_photo.content_type.split("/")[-1]
    ext3 = user3_photo.content_type.split("/")[-1]
    ext4 = user4_photo.content_type.split("/")[-1]
    ext5 = user5_photo.content_type.split("/")[-1]    
    ext6 = user6_photo.content_type.split("/")[-1]    

    os.makedirs(IMG_PATH, exist_ok=True)
    os.makedirs(IMG_PATH_TORNEO, exist_ok=True)

    with open(f"{IMG_PATH_TORNEO}/est_{user1_name}.{ext1}", "wb") as f:
        f.write(img1_contents)
    with open(f"{IMG_PATH_TORNEO}/est_{user2_name}_.{ext2}", "wb") as f:
        f.write(img2_contents)
    with open(f"{IMG_PATH_TORNEO}/est_{user3_name}_.{ext3}", "wb") as f:
        f.write(img3_contents)
    with open(f"{IMG_PATH_TORNEO}/est_{user4_name}_.{ext4}", "wb") as f:
        f.write(img4_contents)
    with open(f"{IMG_PATH_TORNEO}/est_{user5_name}_.{ext5}", "wb") as f:
        f.write(img5_contents)
    with open(f"{IMG_PATH_TORNEO}/est_{user6_name}_.{ext6}", "wb") as f:
        f.write(img6_contents)

    est1 = {
        "name": user1_name,
        "img_url": f"/{IMG_PATH_TORNEO}/est_{user1_name}_.{ext1}",
        "equipo_id": team_id
    }
    est2 = {
        "name": user2_name,
        "img_url": f"/{IMG_PATH_TORNEO}/est_{user2_name}_.{ext2}",
        "equipo_id": team_id
    }
    est3 = {
        "name": user3_name,
        "img_url": f"/{IMG_PATH_TORNEO}/est_{user3_name}_.{ext3}",
        "equipo_id": team_id
    }
    est4 = {
        "name": user4_name,
        "img_url": f"/{IMG_PATH_TORNEO}/est_{user4_name}_.{ext4}",
        "equipo_id": team_id
    }
    est5 = {
        "name": user5_name,
        "img_url": f"/{IMG_PATH_TORNEO}/est_{user5_name}_.{ext5}",
        "equipo_id": team_id
    }
    est6 = {
        "name": user6_name,
        "img_url": f"/{IMG_PATH_TORNEO}/est_{user6_name}_.{ext6}",
        "equipo_id": team_id
    }

    futbol_player1 = FutbolPlayer.model_validate(est1)
    futbol_player2 = FutbolPlayer.model_validate(est2)
    futbol_player3 = FutbolPlayer.model_validate(est3)
    futbol_player4 = FutbolPlayer.model_validate(est4)
    futbol_player5 = FutbolPlayer.model_validate(est5)
    futbol_player6 = FutbolPlayer.model_validate(est6)
    
    await db_commit(futbol_player1)
    await db_commit(futbol_player2)
    await db_commit(futbol_player3)
    await db_commit(futbol_player4)
    await db_commit(futbol_player5)
    await db_commit(futbol_player6)

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
    data = db_select_query(query)
    for player in data:
        await db_delete_unique(FutbolPlayer,player.id)

    return {"message":"Jugadores eliminado con Exito"}