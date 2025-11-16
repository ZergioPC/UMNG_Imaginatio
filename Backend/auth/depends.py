from typing import Optional
from fastapi import HTTPException, Cookie

from models.equipo import Equipo
from db import db_get_equipo_by_name

from auth.admin import ADMIN_DATA
from auth.utils import ACTIVE_SESSIONS


def get_current_user(session_token: Optional[str] = Cookie(None, alias="imaginatio_session")) -> Equipo:
    """
    Dependency: Valida que el usuario esté autenticado.
    Retorna el equipo si la sesión es válida.
    """
    if not session_token:
        raise HTTPException(
            status_code=401, 
            detail=f"No estás autenticado. Por favor inicia sesión."
        )
    
    equipo_name = ACTIVE_SESSIONS.get(session_token)

    if not equipo_name:
        raise HTTPException(
            status_code=401, 
            #detail="Sesión inválida o expirada. Por favor inicia sesión nuevamente."
            detail=f"ses: {session_token}"
        )
    
    equipo = db_get_equipo_by_name(equipo_name)

    return equipo

def get_current_admin(session_token:Optional[str] = Cookie(None, alias="imaginatio_admin")) -> str:
    """
    Dependency: Valida que el usuario esté autenticado.
    Retorna el username si la sesión es válida.
    """
    adminData = ADMIN_DATA["session"]
    if not session_token:
        raise HTTPException(
            status_code=401, 
            #detail="No estás en Admin. Por favor inicia sesión."
            detail=f"ses: {session_token} - adminDada: {adminData}"
        )

    if (session_token != ADMIN_DATA["session"]):
        raise HTTPException(
            status_code=401, 
            detail="Sesión inválida o expirada. Por favor inicia sesión nuevamente."
        )
    
    return "Admin"