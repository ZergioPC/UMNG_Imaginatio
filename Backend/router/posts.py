import os

from fastapi import APIRouter, status, Depends, HTTPException
from typing import Optional

from models.posts import Post, PostWithEquipoResponse,PostsListResponse
from models.equipo import Equipo

from db import db_select_unique, db_update, db_select_query, db_delete_unique, select
from auth.depends import get_current_user, get_current_admin
from router.equipo import IMG_PATH

router = APIRouter()

@router.get("/get/{id}")
async def post_get_unique(id:int):
    post = await db_select_unique(Post,id)
    return {"data":post,"message":f"Post #{id}"}

from sqlmodel import func

@router.get("/pages/{pag}", response_model=PostsListResponse)
async def post_pag(pag: int):
    offset = pag * 15
    limit = 15
    
    # Contar total de posts
    count_query = select(func.count()).select_from(Post)
    total = await db_select_query(count_query)
    
    # Query principal con JOIN, paginación y orden
    query = (
        select(Post, Equipo.name, Equipo.img)
        .join(Equipo, Post.equipo_id == Equipo.equipo_id)
        .offset(offset)
        .limit(limit)
        .order_by(Post.post_id.desc())
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
    
    total_pages = (len(total) + limit - 1) // limit
    
    return PostsListResponse(
        data=data,
        message=f"Lista de Posts - página {pag}",
        pages=total_pages
    )

@router.patch("/like/{id}",status_code=status.HTTP_202_ACCEPTED)
async def post_like(id:int):
    post = await db_select_unique(Post,id)
    post_data = post.model_dump()
    post_data["likes"] += 1
    await db_update(Post, id, post_data)
    return {"data":f"like al post {id}"}

@router.delete("/delete/{id}", status_code=status.HTTP_202_ACCEPTED)
async def borrar_by_team(id:int, current_team:Equipo = Depends(get_current_user)):
    post:Post = await db_select_unique(Post,id)

    if current_team.equipo_id != post.equipo_id:
        raise HTTPException(
            status_code=403,
            detail="No puedes Borrar un Post para otro equipo"
        )
    
    
    if post.img and os.path.exists(post.img):
        if not post.img.startswith("uploads/"):
            raise HTTPException(400, "Invalid image path")
        
        try:
            os.remove(post.img)
            await db_delete_unique(Post, id)
        except Exception as e:
            print("Error deleting file:", e)

    return {"message":"Evento eliminado con Exito"}

@router.delete("/delete-by-admin/{id}", status_code=status.HTTP_202_ACCEPTED)
async def borrar_by_admin(id:int, current_admin:str = Depends(get_current_admin)):   
    if not current_admin:
        raise HTTPException(401,"No eres admin") 
    
    post:Post = await db_select_unique(Post, id)

    if not post.img.startswith("uploads/"):
            raise HTTPException(400, "Invalid image path")
    
    if post.img and os.path.exists(post.img):
        os.remove(post.img)
        await db_delete_unique(Post,id)

    return {"message":"Evento eliminado con Exito"}