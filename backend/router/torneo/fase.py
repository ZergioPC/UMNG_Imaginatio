import logging
from fastapi import APIRouter, status, Depends, HTTPException
from sqlalchemy.orm import aliased

from models.torneo.fase import Fase, FaseBase
from models.torneo.partido import Partido
from models.torneo.futbolTeam import FutbolTeam

from db import select, db_commit, db_delete_unique, db_select_query, db_select_unique
from auth.depends import get_current_admin

router = APIRouter()

Equipo1 = aliased(FutbolTeam)
Equipo2 = aliased(FutbolTeam)

@router.get("/get/{id}")
async def get_id (id:int):
    fase = await db_select_unique(Fase, id)
    
    query = select(
        Partido,
        Equipo1.name.label("equipo_1_name"),
        Equipo2.name.label("equipo_2_name"),
    ).outerjoin(
        Equipo1, Partido.equipo_1 == Equipo1.id
    ).outerjoin(
        Equipo2, Partido.equipo_2 == Equipo2.id
    ).where(Partido.fase_id == id)
    
    try:
        rows = await db_select_query(query)
    except Exception:
        rows = []
    
    partidos = []
    for row in rows:
        if hasattr(row, '_mapping'):
            mapping = row._mapping
            partido_obj = mapping.get("Partido")
            partidos.append({
                "id": partido_obj.id if partido_obj else 0,
                "equipo_1_score": partido_obj.equipo_1_score if partido_obj else 0,
                "equipo_2_score": partido_obj.equipo_2_score if partido_obj else 0,
                "equipo_1_name": mapping.get("equipo_1_name"),
                "equipo_2_name": mapping.get("equipo_2_name"),
                "winner": partido_obj.winner if partido_obj else None,
            })
    
    return {
        "fase": {
            "id": fase.id,
            "name": fase.name
        },
        "partidos": partidos
    }

@router.get("/get")
async def get_data():
    query = select(Fase)
    fases = await db_select_query(query)
    return {"data":fases,"message":"Lista de Fases"}

@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_fase(fase:FaseBase, admin:str = Depends(get_current_admin)):
    fase_new = Fase.model_validate(fase.model_dump())
    await db_commit(fase_new)
    return {"message":"Fase creado con Exito"}

@router.delete("/delete/{id}", status_code=status.HTTP_403_FORBIDDEN)
async def borrar(id:int, admin:str=Depends(get_current_admin)):
    await db_delete_unique(Fase,id)
    return {"message":"Fase eliminado con Exito"}