from datetime import date
from fastapi import APIRouter, status, HTTPException
from db import select, db_select_query

from models.torneo.futbolTeam import FutbolTeam

router = APIRouter()

def aux_imaginatio_date_validate():
    return True

@router.get("/teams-disponibles", status_code=status.HTTP_201_CREATED)
async def teams_disponibles():
    isTeamsDisponibles = False;
    try:
        query = select(FutbolTeam).where(FutbolTeam.fulled == False)
        teams_disponibles = await db_select_query(query)
        if teams_disponibles: 
            isTeamsDisponibles = True 
    except Exception:
        isTeamsDisponibles = False

    return {
        "message": "Hay equipos disponibles?",
        "data": isTeamsDisponibles
    }