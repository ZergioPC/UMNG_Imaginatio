import os

from fastapi import APIRouter, Depends, Form, File, UploadFile, HTTPException

from auth.depends import get_current_admin
from utils import IMG_PATH_USERS

router = APIRouter()

@router.post("/placeholder-img")
async def placeholderImg(
    img: UploadFile = File(...),
    current_admin:str=Depends(get_current_admin)
):    
    if not img.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid image type")

    if img is not None:
        if not img.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Tipo de imagen inválido")
        
        contents = await img.read()
        
        # Guardar la imagen
        with open(f"{IMG_PATH_USERS}/idle.jpg", "wb") as f:
            f.write(contents)

    return {"message":"Placeholder Cambiado"}