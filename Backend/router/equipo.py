from fastapi import APIRouter

router = APIRouter()

# CRUD
@router.post("/post")
async def postear():
    return {"data":"add post"}

@router.post("/crear")
async def crear(pag:int):
    return {"data":"Crear equipo"}

@router.patch("/editar/{id}")
async def editar(id:int):
    return {"data":f"Editar Equipo {id}"}

# GET DATA

@router.get("/{id}")
async def get_equipo_info(id:int):
    return {"data":f"Info del equipo {id}"}

@router.get("/persona/{id}")
async def get_member_info(id:int):
    return {"data":f"Info del estudiante {id}"}