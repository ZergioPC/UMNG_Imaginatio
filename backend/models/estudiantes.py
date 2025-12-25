from sqlmodel import SQLModel, Field
from typing import Optional

class EstudianteBase(SQLModel):
    name:str
    img:str
    codigo:str
    desc:str|None
    phone:str|None
    email:str|None
    instagram:str|None
    twiter:str|None
    tiktok:str|None

class EstudianteEdit(SQLModel):
    name: Optional [str] = Field(default="") 
    img: Optional [str] = Field(default=None) 
    codigo: Optional [str] = Field(default="") 
    desc: Optional [str] = Field(default="")
    phone: Optional [str] = Field(default="")
    email: Optional [str] = Field(default="")
    instagram: Optional [str] = Field(default="")
    twiter: Optional [str] = Field(default="")
    tiktok: Optional [str] = Field(default="")

class Estudiante(EstudianteBase, table=True):
    __tablename__ = "estudiante"
    est_id:int|None = Field(default=None, primary_key=True)
    equipo_id:int|None = Field(foreign_key="equipo.equipo_id")