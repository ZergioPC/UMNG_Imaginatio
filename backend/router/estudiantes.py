import os, logging
from uuid import uuid4
from fastapi import APIRouter, status, Depends, HTTPException, Form, File, UploadFile

from models.equipo import Equipo
from models.estudiantes import EstudianteBase, EstudianteEdit, Estudiante

from db import db_commit, db_select_query, db_select_range, db_select_unique, db_delete_unique, db_update, select
from auth.depends import get_current_user

from utils import IMG_PATH, IMG_PATH_USERS

router = APIRouter()

# GET DATA

@router.get("/{id}")
async def estudiante_get(id:int):
    est = await db_select_unique(Estudiante,id)
    return {
        "data":est
    }


@router.get("/filter/{equipo_id}")
async def estudiantes_get_filter(equipo_id:int):
    query = select(Estudiante).where(Estudiante.equipo_id == equipo_id)
    data = await db_select_query(query)
    return {"data":data,"message":f"Estudiantes del equipo {equipo_id}"}

# CRUD Estudiante

@router.post("/crear", status_code=status.HTTP_201_CREATED)
async def estudiante_crear(
    name: str = Form(...),
    codigo: str = Form(...),
    desc: str | None = Form(None),
    phone: str | None = Form(None),
    email: str | None = Form(None),
    instagram: str | None = Form(None),
    twiter: str | None = Form(None),
    tiktok: str | None = Form(None),
    img: UploadFile = File(...),
    current_team: Equipo = Depends(get_current_user)
):  
    if not img.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid image type")

    contents = await img.read()

    # Save or process the image
    filename = f"{uuid4()}.jpg"
    os.makedirs(IMG_PATH, exist_ok=True)
    os.makedirs(IMG_PATH_USERS, exist_ok=True)
    with open(f"{IMG_PATH_USERS}/{filename}", "wb") as f:
        f.write(contents)

    # Build your DB object manually
    data = {
        "name": name,
        "codigo": codigo,
        "desc": desc,
        "phone": phone,
        "email": email,
        "instagram": instagram,
        "twiter": twiter,
        "tiktok": tiktok,
        "equipo_id": current_team.equipo_id,
        "img": f"{IMG_PATH_USERS}/{filename}",
    }

    est = Estudiante.model_validate(data)
    await db_commit(est)

    return {"message": "Estudiante creado con éxito"}  

@router.patch("/editar/{id}", status_code=status.HTTP_202_ACCEPTED)
async def estudiante_editar(
    id: int,
    name: str = Form(None),
    codigo: str = Form(None),
    desc: str = Form(None),
    phone: str = Form(None),
    email: str = Form(None),
    instagram: str = Form(None),
    twiter: str = Form(None),
    tiktok: str = Form(None),
    img: UploadFile = File(None),
    equipo_id: int = Form(None),
    current_team: Equipo = Depends(get_current_user)
):
    equipo_actual = await db_select_unique(Equipo, equipo_id)
    if current_team.equipo_id != equipo_actual.equipo_id:
        raise HTTPException(
            status_code=403,
            detail="No puedes Editar un Estudiante de otro equipo"
        )
    
    estudiante = await db_select_unique(Estudiante,id)
    if not estudiante:
        raise HTTPException(
            status_code=404,
            detail="Estudiante no existe"
        )
    
    # Preparar los datos para actualizar
    data_dump = {}
    
    if name is not None:
        data_dump["name"] = name
    if codigo is not None:
        data_dump["codigo"] = codigo
    if desc is not None:
        data_dump["desc"] = desc
    if phone is not None:
        data_dump["phone"] = phone
    if email is not None:
        data_dump["email"] = email
    if instagram is not None:
        data_dump["instagram"] = instagram
    if twiter is not None:
        data_dump["twiter"] = twiter
    if tiktok is not None:
        data_dump["tiktok"] = tiktok
    if equipo_id is not None:
        data_dump["equipo_id"] = equipo_id
    
    # Procesar la imagen si se proporcionó
    if img is not None:
        if not img.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Tipo de imagen inválido")
        
        contents = await img.read()
        
        # Guardar la imagen
        filename = f"{uuid4()}.jpg"
        os.makedirs(IMG_PATH, exist_ok=True)
        os.makedirs(IMG_PATH_USERS, exist_ok=True)
        
        with open(f"{IMG_PATH_USERS}/{filename}", "wb") as f:
            f.write(contents)
        
        data_dump["img"] = f"{IMG_PATH_USERS}/{filename}"
    
    # Solo actualizar si hay datos
    if data_dump:
        await db_update(Estudiante, id, data_dump)
    
    return {"message": "Estudiante editado con éxito"}

@router.delete("/delete/{id}", status_code=status.HTTP_202_ACCEPTED)
async def estudiante_borrar(id:int, current_team:Equipo=Depends(get_current_user)):
    est:Estudiante = await db_select_unique(Estudiante,id)

    if current_team.equipo_id != est.equipo_id:
        raise HTTPException(
            status_code=403,
            detail="No puedes Borrar un Estudiante para otro equipo"
        )

    await db_delete_unique(Estudiante,id)
    return {"message":"Estudiante eliminado con Exito"}