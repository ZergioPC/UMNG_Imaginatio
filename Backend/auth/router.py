from fastapi import APIRouter, HTTPException, Response, Depends, status

from auth.models import LoginRequest, LoginResponse, AdminRequest
from auth.depends import ACTIVE_SESSIONS
from auth.utils import crear_session_token, verify_password
from auth.admin import ADMIN_DATA

from models.equipo import Equipo

from db import db_get_equipo_by_name

router = APIRouter()

@router.post("/login")
async def login(credentials: LoginRequest, response: Response):
    """
    Endpoint de login: valida credenciales y crea sesión.
    """
    # 1. Verificar si el usuario existe
    data = await db_get_equipo_by_name(credentials.name)
    if not data:
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")

    # 2. Verificar la contraseña
    equipo = Equipo.model_dump(data)
    validation = verify_password(credentials.password, equipo["equipo_password"])
    if not validation:
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")
    
    # 3. Crear token de sesión
    token = crear_session_token()
    
    # 4. Guardar la sesión
    ACTIVE_SESSIONS[token] = credentials.name
    
    # 5. Enviar cookie al cliente
    response.set_cookie(
        key="imaginatio_session",
        value=token,
        httponly=True,  # Protección contra XSS
        max_age=3600,   # 1 hora de duración
        samesite="lax"  # Protección contra CSRF
    )
    
    return {
        "message": "Login exitoso",
        "user": credentials.name
    }


@router.post("/admin")
async def admin_login(data: AdminRequest, response: Response):
    if(data.name != ADMIN_DATA["user"] or data.password != ADMIN_DATA["password"]):
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")
    
    token = crear_session_token()

    ADMIN_DATA["session"] = token

    response.set_cookie(
        key="imaginatio_admin",
        value=token,
        httponly=True,  # Protección contra XSS
        max_age=3600,   # 1 hora de duración
        samesite="lax"  # Protección contra CSRF
    )
    
    return {
        "message": "Login de Admin exitoso",
        "user": "Admin"
    }