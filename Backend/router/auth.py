from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def home():
    # Comprobar la cookie de auth
    auth = False        
    if auth:
        return {"dom":"true"}
    else:
        return {"dom":"false"}