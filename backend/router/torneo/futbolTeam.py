from fastapi import APIRouter, status, Depends, HTTPException
from sqlalchemy.orm import aliased

from models.torneo.futbolTeam import FutbolTeamBase, FutbolTeam
from models.torneo.futbolPlayer import FutbolPlayer
from models.torneo.futbolProfesor import FutbolProfesor
from models.torneo.fase import Fase
from router.torneo.utils import aux_imaginatio_date_validate

from db import db_commit, db_delete_unique, db_select_unique, db_select_query, select, db_update
from auth.depends import get_current_admin

router = APIRouter()

@router.get("/get/{id}")
async def get (id:int):
    team = await db_select_unique(FutbolTeam, id)
    
    query_profe = select(FutbolProfesor).where(FutbolProfesor.equipo_id == id)
    profesores = await db_select_query(query_profe)
    
    query_players = select(FutbolPlayer).where(FutbolPlayer.equipo_id == id)
    players = await db_select_query(query_players)
    
    return {
        "data": {
            "team": team,
            "profesor": profesores[0] if profesores and aux_imaginatio_date_validate() else None,
            "players": players
        },
        "message": "Info del FutbolTeam"
    }

@router.get("/get")
async def get_data():
    query = select(FutbolTeam)
    teams = await db_select_query(query)
    return {"data":teams,"message":"Lista de Equipos"}

@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_fase(team:FutbolTeamBase, admin:str = Depends(get_current_admin)):
    try:
        fases = await db_select_query(select(Fase))
        if (len(fases) <= 0):
            raise Exception("No hay fases creadas aun")
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No hay Fases disponibles"
        )
    
    team_new = FutbolTeam.model_validate(team.model_dump())
    await db_commit(team_new)
    return {"message":"FutbolTeam creado con Exito"}

@router.delete("/delete/{id}", status_code=status.HTTP_403_FORBIDDEN)
async def borrar(id:int, admin:str=Depends(get_current_admin)):
    query = select(FutbolPlayer).where(FutbolPlayer.equipo_id == id)
    data = db_select_query(query)
    for player in data:
        await db_delete_unique(FutbolPlayer,player.id)
    
    await db_delete_unique(FutbolProfesor,id)
    await db_delete_unique(FutbolTeam,id)
    return {"message":"FutbolTeam eliminado con Exito"}

@router.delete("/free-profe/{id}")
async def free_profesor(id:int, admin:str=Depends(get_current_admin)):
    await db_delete_unique(FutbolProfesor,id)

    current_team:FutbolTeam = await db_select_unique(FutbolTeam,id)
    current_team_data = current_team.model_dump()
    current_team_data["hasProfesor"] = False
    await db_update(FutbolTeam, id, current_team_data)

    return {"message":"Profesor eliminado del equipo con Exito"}

@router.delete("/free-players/{id}")
async def free_players(id:int, admin:str=Depends(get_current_admin)):
    query = select(FutbolPlayer).where(FutbolPlayer.equipo_id == id)
    data = await db_select_query(query)
    for player in data:
        await db_delete_unique(FutbolPlayer,player.id)

    current_team:FutbolTeam = await db_select_unique(FutbolTeam,id)
    current_team_data = current_team.model_dump()
    current_team_data["fulled"] = False
    await db_update(FutbolTeam, id, current_team_data)
    
    return {"message":"Estudiantes eliminado del equipo con Exito"}