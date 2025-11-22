import os
from uuid import uuid4

from fastapi import APIRouter, status, Depends, HTTPException, Form, File, UploadFile
from typing import Optional

from models.equipo import EstudianteBase, EquipoBase, EstudianteEdit, EquipoEdit, Estudiante, Equipo
from models.posts import PostBase, Post

from db import db_commit, db_select_query, db_select_unique, db_delete_unique, db_update, select
from auth.utils import hash_password
from auth.depends import get_current_user, get_current_admin

from utils import IMG_PATH, IMG_PATH_POSTS, IMG_PATH_USERS

router = APIRouter()

@router.get("/healty")
async def healty(current_team:Equipo=Depends(get_current_user)):
    return {"message":"Ok"}

# CRUD Equipo
@router.post("/crear", status_code=status.HTTP_201_CREATED)
async def equipo_crear(equipo_data:EquipoBase, current_admin:str=Depends(get_current_admin)):
    equipo = Equipo.model_validate(equipo_data.model_dump())
    equipo.equipo_password = hash_password(equipo.equipo_password)
    await db_commit(equipo)
    return {"message":"Equipo creado con Exito"}

@router.patch("/editar/{id}",status_code=status.HTTP_202_ACCEPTED)
async def editar(id:int, equipo_data:EquipoEdit, current_team:Equipo=Depends(get_current_user)):
    if current_team.id != id:
        raise HTTPException(
            status_code=403,
            detail="No puedes editar el perfil de otro usuario"
        )
    
    data_dump = equipo_data.model_dump(exclude_unset=True)
    await db_update(Equipo, id, data_dump) 
    return {"message":"Equipo editado con Exito"}

@router.delete("/delete/{id}", status_code=status.HTTP_403_FORBIDDEN)
async def equipo_borrar(id:int, current_admin:str=Depends(get_current_admin)):
    await db_delete_unique(Equipo,id)
    return {"message":"Equipo eliminado con Exito"}

# CRUD Estudiante
"""
@router.post("/estudiante/crear", status_code=status.HTTP_201_CREATED)
async def estudiante_crear(est_data:EstudianteBase, current_team:Equipo=Depends(get_current_user)):
    est = Estudiante.model_validate(est_data.model_dump())

    if current_team.equipo_id != est.equipo_id:
        raise HTTPException(
            status_code=403,
            detail="No puedes Crear un Estudiante para otro"
        )
    
    await db_commit(est)
    return {"message":"Estudiante creado con Exito"}
"""

@router.post("/estudiante/crear", status_code=status.HTTP_201_CREATED)
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

@router.patch("/estudiante/editar/{id}",status_code=status.HTTP_202_ACCEPTED)
async def estudiante_editar(id:int, est_data:EstudianteEdit, current_team:Equipo=Depends(get_current_user)):
    data_dump = est_data.model_dump(exclude_unset=True)
        
    if current_team.id != data_dump.get("equipo_id"):
        raise HTTPException(
            status_code=403,
            detail="No puedes Editar un Estudiante para otro equipo"
        )

    await db_update(Estudiante, id, data_dump) 
    return {"message":"Estudiante editado con Exito"}

@router.delete("/estudiante/delete/{id}", status_code=status.HTTP_403_FORBIDDEN)
async def estudiante_borrar(id:int, current_team:Equipo=Depends(get_current_user)):
    est:Estudiante = await db_select_unique(Estudiante,id)

    if current_team.id != est.equipo_id:
        raise HTTPException(
            status_code=403,
            detail="No puedes Borrar un Estudiante para otro equipo"
        )

    await db_delete_unique(Estudiante,id)
    return {"message":"Estudiante eliminado con Exito"}

# GET DATA

@router.get("/get/{id}")
async def equipo_get_info(id:int):
    equipo = await db_select_unique(Equipo, id)
    return {"data":equipo,"message":"Info del Equipo"}

@router.get("/filter/{evento_id}")
async def equipo_get_filter(evento_id:int):
    query = select(Equipo).where(Equipo.evento_id == evento_id)
    data = await db_select_query(query)
    return {"data":data,"message":f"Equipos del torneo {evento_id}"}

@router.get("/estudiante/filter/{equipo_id}")
async def estudiante_get_filter(equipo_id:int):
    query = select(Estudiante).where(Estudiante.equipo_id == equipo_id)
    data = await db_select_query(query)
    return {"data":data,"message":f"Estudiantes del equipo {equipo_id}"}

# POSTS
"""
@router.post("/publicar")
async def equipo_publicar(post_data:PostBase, current_team:str = Depends(get_current_user)):
    data = post_data.model_dump()
    data["equipo_id"] = current_team.equipo_id
    post:Post = Post.model_validate(data)

    await db_commit(post)
    return {"message":"Post creado con Exito"}
"""

@router.post("/publicar")
async def equipo_publicar(
    title: str = Form(...),
    description: str = Form(...),
    image: UploadFile = File(...),
    current_team: str = Depends(get_current_user)
):    
    # Validate file
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid image type")

    contents = await image.read()

    # Save or process the image
    filename = f"{uuid4()}.jpg"
    os.makedirs(IMG_PATH, exist_ok=True)
    os.makedirs(IMG_PATH_POSTS, exist_ok=True)
    with open(f"{IMG_PATH_POSTS}/{filename}", "wb") as f:
        f.write(contents)

    # Build your DB object manually
    data = {
        "title": title,
        "desc": description,
        "img": f"{IMG_PATH_POSTS}/{filename}",
        "equipo_id": current_team.equipo_id,
    }

    post = Post.model_validate(data)
    await db_commit(post)

    return {"message": "Post creado con éxito"}


@router.get("/publicaciones/{id}")
async def equipo_publicaciones(id:int):
    query = select(Post).where(Post.equipo_id == id)
    data = await db_select_query(query)
    return {"data":data,"message":f"Posts del equipo {id}"}