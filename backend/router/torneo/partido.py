import logging
from fastapi import APIRouter, status, Depends, HTTPException
from sqlmodel import select

from models.torneo.partido import Partido, PartidoBase, PartidoEdit
from models.torneo.futbolTeam import FutbolTeam
from models.torneo.futbolPlayer import FutbolPlayer
from models.torneo.futbolProfesor import FutbolProfesor
from models.torneo.fase import Fase

from db import db_commit, db_delete_unique, db_select_unique, db_select_query, db_update
from router.torneo.utils import aux_imaginatio_date_validate
from auth.depends import get_current_admin

router = APIRouter()

async def aux_get_team_info(team_id: int):
    """Get full team info including profesor and players"""
    if not team_id:
        return None
    
    team = await db_select_unique(FutbolTeam, team_id)
    
    players = []
    try :
        query_players = select(FutbolPlayer).where(FutbolPlayer.equipo_id == team_id)
        players = await db_select_query(query_players)
    except :
        logging.warning("No hay Jugadores")

    profesor = None
    try:
        query_profe = select(FutbolProfesor).where(FutbolProfesor.equipo_id == team_id)
        profesores = await db_select_query(query_profe)
        
        if aux_imaginatio_date_validate:
            profesor = profesores[0]
    except:
        logging.warning("No hay profesor")
    
    return {
        "team": team,
        "profesor": profesor,
        "players": players
    }

@router.get("/get/{id}")
async def get (id:int):
    partido = await db_select_unique(Partido, id)
    
    equipo_1_info = await aux_get_team_info(partido.equipo_1)
    equipo_2_info = await aux_get_team_info(partido.equipo_2)
    
    return {
        "data": {
            "partido": partido,
            "equipo_1": equipo_1_info,
            "equipo_2": equipo_2_info,
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

@router.patch("/edit/{id}", status_code=status.HTTP_202_ACCEPTED)
async def editar(id:int, partido:PartidoEdit, admin:str = Depends(get_current_admin)):
    data_dump = partido.model_dump(exclude_unset=True)
    await db_update(Partido, id, data_dump)
    return {"message":"Partido editado con Exito"}

@router.delete("/delete/{id}", status_code=status.HTTP_403_FORBIDDEN)
async def borrar(id:int, admin:str=Depends(get_current_admin)):
    await db_delete_unique(Partido,id)
    return {"message":"Partido eliminado con Exito"}