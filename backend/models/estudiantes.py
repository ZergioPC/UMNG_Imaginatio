from sqlmodel import SQLModel, Field
from typing import Optional

class EstudianteBase(SQLModel):
    name:str = Field(default="", max_length=25)
    img:str = Field(default=None)
    codigo:str = Field(default="", max_length=10)
    desc:str|None = Field(default="", max_length=250)
    phone:str|None = Field(default="", max_length=15)
    email:str|None = Field(default="", max_length=50)
    instagram:str|None = Field(default="", max_length=25)
    twiter:str|None = Field(default="", max_length=25)
    tiktok:str|None = Field(default="", max_length=25)

class EstudianteEdit(SQLModel):
    name: Optional [str] = Field(default="", max_length=25)
    img: Optional [str] = Field(default=None)
    codigo: Optional [str] = Field(default="", max_length=10)
    desc: Optional [str] = Field(default="", max_length=250)
    phone: Optional [str] = Field(default="", max_length=15)
    email: Optional [str] = Field(default="", max_length=50)
    instagram: Optional [str] = Field(default="", max_length=25)
    twiter: Optional [str] = Field(default="", max_length=25)
    tiktok: Optional [str] = Field(default="", max_length=25)

class Estudiante(EstudianteBase, table=True):
    __tablename__ = "estudiante"
    est_id:int|None = Field(default=None, primary_key=True)
    equipo_id:int|None = Field(foreign_key="equipo.equipo_id")