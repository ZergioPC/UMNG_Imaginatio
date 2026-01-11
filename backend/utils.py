import os
from dotenv import load_dotenv

load_dotenv()

DOMAIN:str = os.getenv("DOMINIO")

DOMAIN_FR:str = f"{DOMAIN}"
DOMAIN_BK:str = f"{DOMAIN}/api"

IMG_PATH:str = "uploads"
IMG_PATH_POSTS:str = "uploads/posts"
IMG_PATH_USERS:str = "uploads/users"