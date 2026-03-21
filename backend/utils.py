import os
from dotenv import load_dotenv

load_dotenv()

DOMAIN:str = os.getenv("DOMINIO")

DOMAIN_FR:str = f"{DOMAIN}"
DOMAIN_BK:str = f"{DOMAIN}/api"

IMG_PATH:str = "uploads"
IMG_PATH_POSTS:str = f"{IMG_PATH}/posts"
IMG_PATH_USERS:str = f"{IMG_PATH}/users"
IMG_PATH_TORNEO:str = f"{IMG_PATH}/torneo"
IMG_PATH_MUESTRAS:str = f"{IMG_PATH}/muestras_academic"