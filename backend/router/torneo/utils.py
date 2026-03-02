import re

from datetime import date
from fastapi import APIRouter, status, HTTPException
from db import select, db_select_query

from models.torneo.futbolTeam import FutbolTeam

router = APIRouter()

def aux_imaginatio_date_validate():
    return True

def aux_name_formater(text:str):
    """
    Replaces whitespace with underscores and removes
    all characters except letters, numbers, and underscores.
    """
    # Replace one or more whitespace characters with a single underscore
    text_spaces = re.sub(r'\s+', '_', text)
    
    # Remove all characters that are not letters, numbers, or underscore
    text_formatted = re.sub(r'[^a-zA-Z0-9_]', '', text_spaces)
    
    return text_formatted

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