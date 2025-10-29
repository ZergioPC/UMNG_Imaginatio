from fastapi import APIRouter, status

from models.posts import Post

from db import db_select_unique, db_update, db_select_range, db_delete_unique

router = APIRouter()

@router.get("/unique/{id}")
async def post_get_unique(id:int):
    post = await db_select_unique(Post,id)
    return {"data":post,"message":f"Post #{id}"}

@router.get("/get/{pag}")
async def post_pag(pag:int):
    offset = pag * 15
    limit = 15
    posts_list = await db_select_range(Post, offset, limit)
    return {"data":posts_list,"message":f"Lista de Post del {offset} al {offset + limit}"}

@router.patch("/like/{id}",status_code=status.HTTP_202_ACCEPTED)
async def post_like(id:int):
    post = await db_select_unique(Post,id)
    post_data = post.model_dump()
    post_data["likes"] += 1
    await db_update(Post, id, post_data)
    return {"data":f"like al post {id}"}

@router.delete("/delete/{id}", status_code=status.HTTP_403_FORBIDDEN)
async def borrar(id:int):
    # Verificar que la peticion venga del dueño del post y validarlo
    await db_delete_unique(Post,id)
    return {"message":"Evento eliminado con Exito"}