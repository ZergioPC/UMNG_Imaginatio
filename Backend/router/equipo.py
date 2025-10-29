from fastapi import APIRouter, status

from models.equipo import EstudianteBase, EquipoBase, EstudianteEdit, EquipoEdit, Estudiante, Equipo
from models.posts import PostBase, Post

from db import db_commit, db_select_query, db_select_unique, db_delete_unique, db_update, select

router = APIRouter()

# CRUD Equipo
@router.post("/crear", status_code=status.HTTP_201_CREATED)
async def equipo_crear(equipo_data:EquipoBase):
    equipo = Equipo.model_validate(equipo_data.model_dump())
    await db_commit(equipo)
    return {"message":"Equipo creado con Exito"}

@router.patch("/editar/{id}",status_code=status.HTTP_202_ACCEPTED)
async def editar(id:int, equipo_data:EquipoEdit):
    data_dump = equipo_data.model_dump(exclude_unset=True)
    await db_update(Equipo, id, data_dump) 
    return {"message":"Equipo editado con Exito"}

@router.delete("/delete/{id}", status_code=status.HTTP_403_FORBIDDEN)
async def equipo_borrar(id:int):
    await db_delete_unique(Equipo,id)
    return {"message":"Equipo eliminado con Exito"}

# CRUD Estudiante
@router.post("/estudiante/crear", status_code=status.HTTP_201_CREATED)
async def estudiante_crear(est_data:EstudianteBase):
    est = Estudiante.model_validate(est_data.model_dump())
    await db_commit(est)
    return {"message":"Estudiante creado con Exito"}

@router.patch("/estudiante/editar/{id}",status_code=status.HTTP_202_ACCEPTED)
async def estudiante_editar(id:int, est_data:EstudianteEdit):
    data_dump = est_data.model_dump(exclude_unset=True)
    await db_update(Estudiante, id, data_dump) 
    return {"message":"Estudiante editado con Exito"}

@router.delete("/estudiante/delete/{id}", status_code=status.HTTP_403_FORBIDDEN)
async def estudiante_borrar(id:int):
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
@router.post("/publicar")
async def equipo_publicar(post_data:PostBase):
    post = Post.model_validate(post_data.model_dump())
    await db_commit(post)
    return {"message":"Post creado con Exito"}

@router.get("/publicaciones/{id}")
async def equipo_publicaciones(id:int):
    query = select(Post).where(Post.equipo_id == id)
    data = await db_select_query(query)
    return {"data":data,"message":f"Posts del equipo {id}"}