from fastapi import APIRouter

router = APIRouter()

# CRUD
@router.post("/post")
async def postear():
    return {"data":"Crear post del evento"}

@router.post("/crear")
async def crear(pag:int):
    return {"data":"Crear evento"}

@router.patch("/editar/{id}")
async def editar(id:int):
    return {"data":f"Editar Evento {id}"}

# GET DATA
@router.get("/{id}")
async def get_equipo_info(id:int):
    return {"data":f"Info del evento {id}"}

@router.get("/{id}/equipos")
async def get_equipo_info(id:int):
    return {"data":f"Equipos del evento {id}"}
