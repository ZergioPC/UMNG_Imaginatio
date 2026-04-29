import os, uuid, logging

from fastapi import APIRouter, Form, File, HTTPException,UploadFile, Depends

from db import db_commit, db_update, db_select_unique, db_delete_unique, db_select_query
from auth.depends import get_current_admin
from models.invitados import Invitados, InvitadosIndexEdit

from utils import IMG_PATH_USERS, IMG_PATH

router = APIRouter()

@router.get("/get")
async def invitados_get():
    from sqlmodel import select
    query = select(Invitados).order_by(Invitados.order_index.desc())
    invitados = await db_select_query(query)
    return {"data": invitados, "message": "Lista de invitados"}

@router.post("/crear")
async def invitados_crear(
    nombre:str = Form(...),
    desc:str = Form(...),
    img:UploadFile = File(...), 
    current_admin:str=Depends(get_current_admin)
):
    data_dump = {}
    
    if nombre is not None:
        data_dump["nombre"] = nombre
    
    if desc is not None:
        data_dump["desc"] = desc

    if img is not None:
        if not img.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Tipo de imagen inválido")
        
        contents = await img.read()
        
        ext = img.content_type.split("/")[-1]
        filename = f"invitado-{uuid.uuid4()}.{ext}"

        os.makedirs(IMG_PATH, exist_ok=True)
        os.makedirs(IMG_PATH_USERS, exist_ok=True)
        
        with open(f"{IMG_PATH_USERS}/{filename}", "wb") as f:
            f.write(contents)
        
        data_dump["img"] = f"/{IMG_PATH_USERS}/{filename}"

    if not data_dump:
        raise HTTPException(status_code=400, detail="No data provided")
    
    invitado = Invitados.model_validate(data_dump)
    await db_commit(invitado)

    return {"message":"Invitado creado con Exito"}

@router.patch("/editar/{id}")
async def invitados_editar(
    id:int,
    nombre:str = Form(None),
    desc:str = Form(None),
    img: UploadFile = File(None),
    current_admin:str=Depends(get_current_admin)
):
    invitado:Invitados = await db_select_unique(Invitados, id)

    if not invitado:
        raise HTTPException(status_code=404, detail="Invitado no encontrado")

    data_dump = {}
    
    if nombre is not None:
        data_dump["nombre"] = nombre

    if desc is not None:
        data_dump["desc"] = desc

    if img is not None:
        if not img.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Tipo de imagen inválido")
        
        contents = await img.read()
        filename = os.path.basename(invitado.img)

        os.makedirs(IMG_PATH, exist_ok=True)
        os.makedirs(IMG_PATH_USERS, exist_ok=True)
        
        with open(f"{IMG_PATH_USERS}/{filename}", "wb") as f:
            f.write(contents)
        
        data_dump["img"] = f"/{IMG_PATH_USERS}/{filename}"

    if not data_dump:
        raise HTTPException(status_code=400, detail="No data provided")
    
    data_dump["order_index"] = 0
    await db_update(Invitados, id, data_dump)

    return {"message":"Invitado editado con Exito"}


@router.delete("/delete/{id}")
async def invitados_borrar(
    id:int, 
    current_admin:str=Depends(get_current_admin)
):
    invitado:Invitados = await db_select_unique(Invitados, id)
    if not invitado:
        raise HTTPException(status_code=404, detail="Invitado no encontrado")

    try:
        if invitado.img and os.path.exists(invitado.img[1:]):
            os.remove(invitado.img[1:])
        await db_delete_unique(Invitados, id)
    except:
        raise HTTPException(status_code=404, detail="Error al eliminar")

    return {"message":"Invitado eliminado con Exito"}


@router.patch("/set_index/{id}")
async def invitados_update_index(
    id:int, 
    index:InvitadosIndexEdit,
    current_admin:str=Depends(get_current_admin)
):
    data_model:Invitados = await db_select_unique(Invitados,id)
    data = data_model.model_dump()
    data["order_index"] = index.order_index

    await db_update(Invitados, id, data)
    return {"data":f"cambio el index del invitado ID_{id}"}
