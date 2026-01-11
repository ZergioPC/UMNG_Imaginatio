import os, logging

from typing import Optional
from fastapi import APIRouter, status, Depends, HTTPException
from sqlmodel import func

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
        .order_by(Post.post_id.desc())
        .offset(offset)
        .limit(limit)
    )
    
    results = await db_select_query(query)
    data = []
    
    # return posts
    for row in results:
        if isinstance(row, tuple) or (hasattr(row, "_mapping") and len(row) > 1):
            post_obj = row[0]
            equipo_name = row[1]
            equipo_img = row[2]
        else:
            post_obj = row
            equipo_name = None
            equipo_img = None

        data.append(PostWithEquipoResponse(
            post_id=post_obj.post_id,
            title=post_obj.title,
            desc=post_obj.desc,
            img=post_obj.img,
            equipo_id=post_obj.equipo_id,
            likes=post_obj.likes,
            equipo_name=equipo_name or "",
            equipo_img=equipo_img or "uploads/users/idle.jpg",
        ))
    
    # total comes from a count query: extract numeric value
    total_count = 0
    if total:
        # total may be a list/rows like [(count,)] or [count]
        try:
            first = total[0]
            if isinstance(first, tuple) or hasattr(first, "_mapping"):
                total_count = int(first[0])
            else:
                total_count = int(first)
        except Exception:
            total_count = 0

    total_pages = (total_count + limit - 1) // limit
    
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