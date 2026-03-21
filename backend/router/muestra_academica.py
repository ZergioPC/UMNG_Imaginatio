import os, uuid

from fastapi import APIRouter, Form, File, HTTPException,UploadFile, Depends

from db import db_commit, db_update, db_select_unique, db_delete_unique
from auth.depends import get_current_admin
from models.muestra_academica import MuestraAcademica

from utils import IMG_PATH_MUESTRAS, IMG_PATH

router = APIRouter()

# MARK:CRUD Muestra academica
@router.post("/crear")
async def muestra_crear(
    title:str = Form(...),
    img: UploadFile = File(...), 
    current_admin:str=Depends(get_current_admin)
):
    data_dump = {}
    
    if title is not None:
        data_dump["title"] = title

    if img is not None:
        if not img.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Tipo de imagen inválido")
        
        contents = await img.read()
        
        # Guardar la imagen
        ext = img.content_type.split("/")[-1]
        filename = f"muestra-{uuid.uuid4()}.{ext}"

        os.makedirs(IMG_PATH, exist_ok=True)
        os.makedirs(IMG_PATH_MUESTRAS, exist_ok=True)
        
        with open(f"{IMG_PATH_MUESTRAS}/{filename}", "wb") as f:
            f.write(contents)
        
        data_dump["img"] = f"/{IMG_PATH_MUESTRAS}/{filename}"

    if not data_dump:
        raise HTTPException(status_code=400, detail="No data provided")
    
    muestra = MuestraAcademica.model_validate(data_dump)
    await db_commit(muestra)

    return {"message":"Muestra creada con Exito"}

@router.patch("/editar/{id}")
async def muestra_editar(
    id:int,
    title:str = Form(None),
    img: UploadFile = File(None), 
    current_admin:str=Depends(get_current_admin)
):
    muestra:MuestraAcademica = await db_select_unique(MuestraAcademica, id)

    if not muestra:
        raise HTTPException(status_code=404, detail="Muestra no encontrada")

    data_dump = {}
    
    if title is not None:
        data_dump["title"] = title

    if img is not None:
        if not img.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Tipo de imagen inválido")
        
        contents = await img.read()
        filename = os.path.basename(muestra.img)

        os.makedirs(IMG_PATH, exist_ok=True)
        os.makedirs(IMG_PATH_MUESTRAS, exist_ok=True)
        
        with open(f"{IMG_PATH_MUESTRAS}/{filename}", "wb") as f:
            f.write(contents)
        
        data_dump["img"] = f"/{IMG_PATH_MUESTRAS}/{filename}"

    if not data_dump:
        raise HTTPException(status_code=400, detail="No data provided")
    
    await db_update(MuestraAcademica, id, data_dump)

    return {"message":"Muestra editada con Exito"}


@router.delete("/delete/{id}")
async def muestra_borrar(
    id:int, 
    current_admin:str=Depends(get_current_admin)
):
    muestra:MuestraAcademica = await db_select_unique(MuestraAcademica, id)
    if not muestra:
        raise HTTPException(status_code=404, detail="Muestra no encontrada")

    try:
        if muestra.img and os.path.exists(muestra.img[1:]):
            os.remove(muestra.img[1:])
        await db_delete_unique(MuestraAcademica, id)
    except:
        raise HTTPException(status_code=404, detail="Error al eliminar")

    return {"message":"Muestra eliminada con Exito"}
