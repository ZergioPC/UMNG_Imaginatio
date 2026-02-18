from fastapi import APIRouter, status, Depends
from sqlalchemy.orm import aliased

from models.torneo.futbolTeam import FutbolTeamBase, FutbolTeam
from models.torneo.futbolPlayer import FutbolPlayer
from models.torneo.futbolProfesor import FutbolProfesor

from db import db_commit, db_delete_unique, db_select_unique, db_select_query, select
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
            "profesor": profesores[0] if profesores else None,
            "players": players
        },
        "message": "Info del FutbolTeam"
    }

@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_fase(team:FutbolTeamBase, admin:str = Depends(get_current_admin)):
    partido_new = FutbolTeam.model_validate(team.model_dump())
    await db_commit(partido_new)
    return {"message":"FutbolTeam creado con Exito"}

@router.delete("/delete/{id}", status_code=status.HTTP_403_FORBIDDEN)
async def borrar(id:int, admin:str=Depends(get_current_admin)):
    await db_delete_unique(FutbolTeam,id)
    return {"message":"FutbolTeam eliminado con Exito"}