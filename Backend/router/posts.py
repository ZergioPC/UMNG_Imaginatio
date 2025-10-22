from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def post_home():
    return {"data":f"Info sobre los post"}

@router.get("/get/{pag}")
async def post_pag(pag:int):
    return {"data":f"post de la pagina {pag}"}

@router.post("/like/{id}")
async def post_like(id:int):
    return {"data":f"like al post {id}"}