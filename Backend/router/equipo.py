import os
from uuid import uuid4

from fastapi import APIRouter, status, Depends, HTTPException, Form, File, UploadFile
from typing import Optional

from models.equipo import EstudianteBase, EquipoBase, EstudianteEdit, EquipoEdit, Estudiante, Equipo
from models.posts import PostBase, Post, PostsListResponse, PostWithEquipoResponse

from db import db_commit, db_select_query, db_select_range, db_select_unique, db_delete_unique, db_update, select
from auth.utils import hash_password
from auth.depends import get_current_user, get_current_admin

from utils import IMG_PATH, IMG_PATH_POSTS, IMG_PATH_USERS

router = APIRouter()

@router.get("/healty")
async def healty(current_team:Equipo=Depends(get_current_user)):
    if not current_team:
        return {"message":"error"}
    id = current_team.equipo_id
    query = select(Equipo).where(Equipo.equipo_id == id)
    data = await db_select_query(query)
    return {
        "message":"ok",
        "data": data
        }

# CRUD Equipo
@router.post("/crear", status_code=status.HTTP_201_CREATED)
async def equipo_crear(equipo_data:EquipoBase, current_admin:str=Depends(get_current_admin)):
    equipo = Equipo.model_validate(equipo_data.model_dump())
    equipo.equipo_password = hash_password(equipo.equipo_password)
    await db_commit(equipo)
    return {"message":"Equipo creado con Exito"}

@router.patch("/editar/{id}", status_code=status.HTTP_202_ACCEPTED)
async def editar(
    id: int,
    name: str = Form(None),
    desc: str = Form(None),
    img: UploadFile = File(None),
    evento_id: int = Form(None),
    current_team: Equipo = Depends(get_current_user)
):
    if current_team.equipo_id != id:
        raise HTTPException(
            status_code=403,
            detail="No puedes editar el perfil de otro usuario"
        )
    
    # Preparar los datos para actualizar
    data_dump = {}
    
    if name is not None:
        data_dump["name"] = name
    if desc is not None:
        data_dump["desc"] = desc
    if evento_id is not None:
        data_dump["evento_id"] = evento_id
    
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
        await db_update(Equipo, id, data_dump)
    
    return {"message": "Equipo editado con éxito"}

@router.delete("/delete/{id}", status_code=status.HTTP_403_FORBIDDEN)
async def equipo_borrar(id:int, current_admin:str=Depends(get_current_admin)):
    await db_delete_unique(Equipo,id)
    return {"message":"Equipo eliminado con Exito"}

# CRUD Estudiante

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

@router.patch("/estudiante/editar/{id}", status_code=status.HTTP_202_ACCEPTED)
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
    equipo_actual = await db_select_unique(Equipo, id)
    if current_team.id != equipo_actual.equipo_id:
        raise HTTPException(
            status_code=403,
            detail="No puedes Editar un Estudiante de otro equipo"
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
    
    # Validar que el equipo tenga permiso para editar
    if equipo_id is not None and current_team.id != equipo_id:
        raise HTTPException(
            status_code=403,
            detail="No puedes Editar un Estudiante para otro equipo"
        )
    
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


@router.get("/publicaciones/{id}", response_model=PostsListResponse)
async def equipo_publicaciones(id: int):
    # Query con JOIN para obtener datos de ambas tablas
    query = (
        select(Post, Equipo.name, Equipo.img)
        .join(Equipo, Post.equipo_id == Equipo.equipo_id)
        .where(Post.equipo_id == id)
    )
    
    results = await db_select_query(query)
    
    # Transformar los resultados al formato del modelo de respuesta
    data = []
    for post, equipo_name, equipo_img in results:
        data.append(PostWithEquipoResponse(
            post_id=post.post_id,
            title=post.title,
            desc=post.desc,
            img=post.img,
            equipo_id=post.equipo_id,
            likes=post.likes,
            equipo_name=equipo_name,
            equipo_img=equipo_img
        ))
    
    return PostsListResponse(
        data=data,
        message=f"Posts del equipo {id}",
        pages=0
    )

@router.get("/publicaciones/{id}/{pag}", response_model=PostsListResponse)
async def equipo_publicaciones(id: int, pag: int):
    offset = pag * 15
    limit = 15
    
    # Query con JOIN y paginación
    query = (
        select(Post, Equipo.name, Equipo.img)
        .join(Equipo, Post.equipo_id == Equipo.equipo_id)
        .where(Post.equipo_id == id)
        .offset(offset)
        .limit(limit)
        .order_by(Post.post_id.desc())  # Opcional: ordenar por más reciente
    )
    
    results = await db_select_query(query)
    
    # Transformar los resultados
    data = []
    for post, equipo_name, equipo_img in results:
        data.append(PostWithEquipoResponse(
            post_id=post.post_id,
            title=post.title,
            desc=post.desc,
            img=post.img,
            equipo_id=post.equipo_id,
            likes=post.likes,
            equipo_name=equipo_name,
            equipo_img=equipo_img
        ))

    total_pages = (len(data) + limit - 1) // limit
    
    return PostsListResponse(
        data=data,
        message=f"Posts del equipo {id} - página {pag} (del {offset} al {offset + limit})",
        pages=total_pages
    )
