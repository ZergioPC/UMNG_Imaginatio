import logging

from typing import Optional
from fastapi import HTTPException, Cookie

from models.equipo import Equipo
from db import db_select_unique, db_select_query, db_delete_unique, db_select_all, select
from utils import DOMAIN_FR

from auth.admin import ADMIN_DATA
from auth.models import SessionList, SessionAdmin

from datetime import datetime, timezone, timedelta

DOMAIN:str = DOMAIN_FR

async def get_current_user(
    session_token:str = Cookie(..., alias="imaginatio_session")
) -> Equipo:
    """
    Dependency: Valida que el usuario esté autenticado.
    Retorna el equipo si la sesión es válida.
    """
    logging.warning(session_token)
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

async def get_current_admin(
    session_token:Optional[str] = Cookie(None, alias="imaginatio_admin")
) -> str:
    """
    Dependency: Valida que el usuario esté autenticado.
    Retorna el username si la sesión es válida.
    """
    if not session_token:
       raise HTTPException(
           status_code=401, 
           detail={
               "message":"No estas en admin",
               "url":f"{DOMAIN}/admin/"
               }        
       )

    #logging.warning("Verificar: " + str(not not session_token))
    
    session:list[SessionAdmin] = await db_select_all(SessionAdmin)

    if len(session) != 1:
        raise HTTPException(
            status_code=404, 
            detail={
                "detail":"Sesión inválida. Intente nuevamente o contacte con soporte",
                "url":f"{DOMAIN}/admin/"
            }
        )
    
    now = datetime.now(timezone.utc)
    
    is_time_expired = (now - session[0].time) > timedelta(hours=1)

    if is_time_expired:
        db_delete_unique(SessionAdmin,session[0].session_id)
        raise HTTPException(
            status_code=401, 
            detail={
                "detail":"Sesión inválida o expirada. Por favor inicia sesión nuevamente.",
                "url":f"{DOMAIN}/admin/"
            }
        )
    
    return "Admin"