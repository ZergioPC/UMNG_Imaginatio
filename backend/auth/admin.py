import os
from dotenv import load_dotenv

load_dotenv()

ADMIN_USER:str = os.getenv("ADMIN_USER")
ADMIN_PASS:str = os.getenv("ADMIN_PASSWORD")

ADMIN_DATA:dict[str,str] = {
    "user":ADMIN_USER,
    "password": ADMIN_PASS,
    "session":""
}