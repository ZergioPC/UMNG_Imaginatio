import logging

from typing import Optional
from fastapi import HTTPException, Cookie

from models.equipo import Equipo
from db import db_select_unique, db_select_query, db_delete_unique, select
from utils import DOMAIN_FR

from auth.admin import ADMIN_DATA
from auth.utils import ACTIVE_SESSIONS
from auth.models import SessionList

from datetime import datetime, timezone, timedelta

DOMAIN:str = DOMAIN_FR

async def get_current_user(
    session_token:str = Cookie(..., alias="imaginatio_session")
) -> Equipo:
    """
    Dependency: Valida que el usuario esté autenticado.
    Retorna el equipo si la sesión es válida.
    """

    #logging.warning("Verificar: " + str(not not session_token))
    
    query = select(SessionList).where(SessionList.token == session_token)
    
    session:list[SessionList] = await db_select_query(query)

    if len(session) != 1:
        raise HTTPException(
            status_code=404, 
            detail={
                "detail":"Sesión inválida. Intente nuevamente o contacte con soporte",
                "url":f"{DOMAIN}/"
            }
        )

    #logging.warning(session[0])
    
    now = datetime.now(timezone.utc)
    
    is_time_expired = (now - session[0].time) > timedelta(hours=1)

    if is_time_expired:
        db_delete_unique(SessionList,session[0].session_id)
        raise HTTPException(
            status_code=401, 
            detail={
                "detail":"Sesión inválida o expirada. Por favor inicia sesión nuevamente.",
                "url":f"{DOMAIN}/"
            }
        )
    
    equipo = await db_select_unique(Equipo,session[0].equipo_id)

    return equipo

def get_current_admin(session_token:Optional[str] = Cookie(None, alias="imaginatio_admin")) -> str:
    """
    Dependency: Valida que el usuario esté autenticado.
    Retorna el username si la sesión es válida.
    """
    adminData = ADMIN_DATA["session"]
    #if not session_token:
    #    raise HTTPException(
    #        status_code=401, 
    #        #detail="No estás en Admin. Por favor inicia sesión."
    #        detail={"message":"No estas en admin","url":f"{DOMAIN}/admin/"}        
    #    )

    #if(session_token != ADMIN_DATA["session"]):
    #    raise HTTPException(
    #        status_code=401, 
    #        detail="Sesión inválida o expirada. Por favor inicia sesión nuevamente."
    #    )
    
    return "Admin"