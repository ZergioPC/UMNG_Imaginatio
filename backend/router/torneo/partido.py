from fastapi import APIRouter, status, Depends, HTTPException
from sqlmodel import select

from models.torneo.partido import Partido, PartidoBase
from models.torneo.futbolTeam import FutbolTeam
from models.torneo.futbolPlayer import FutbolPlayer
from models.torneo.futbolProfesor import FutbolProfesor
from models.torneo.fase import Fase

from db import db_commit, db_delete_unique, db_select_unique, db_select_query
from auth.depends import get_current_admin

router = APIRouter()

async def aux_get_team_info(team_id: int):
    """Get full team info including profesor and players"""
    if not team_id:
        return None
    
    team = await db_select_unique(FutbolTeam, team_id)
    
    query_profe = select(FutbolProfesor).where(FutbolProfesor.equipo_id == team_id)
    profesores = await db_select_query(query_profe)
    
    query_players = select(FutbolPlayer).where(FutbolPlayer.equipo_id == team_id)
    players = await db_select_query(query_players)
    
    return {
        "team": team,
        "profesor": profesores[0] if profesores else None,
        "players": players
    }

@router.get("/get/{id}")
async def get (id:int):
    partido = await db_select_unique(Partido, id)
    
    equipo_1_info = await aux_get_team_info(partido.equipo_1)
    equipo_2_info = await aux_get_team_info(partido.equipo_2)
    
    winner_info = await aux_get_team_info(partido.winner) if partido.winner else None
    
    return {
        "data": {
            "partido": partido,
            "equipo_1": equipo_1_info,
            "equipo_2": equipo_2_info,
            "winner": winner_info
        },
        "message": "Info del evento"
    }

@router.get("/get")
async def get_data():
    query = select(Partido)
    partidos = await db_select_query(query)
    return {"data":partidos,"message":"Lista de Partidos"}

@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_fase(partido:PartidoBase, admin:str = Depends(get_current_admin)):
    try:
        fases = await db_select_query(select(Fase))
        if (len(fases) <= 0):
            raise Exception("No hay fases creadas aun")
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No hay equipos disponibles"
        )

    partido_new = Partido.model_validate(partido.model_dump())
    await db_commit(partido_new)
    return {"message":"Partido creado con Exito"}

@router.delete("/delete/{id}", status_code=status.HTTP_403_FORBIDDEN)
async def borrar(id:int, admin:str=Depends(get_current_admin)):
    await db_delete_unique(Partido,id)
    return {"message":"Partido eliminado con Exito"}