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
    name: Optional [str] = Field(default=None) 
    img: Optional [str] = Field(default=None) 
    codigo: Optional [str] = Field(default=None) 
    desc: Optional [str] = Field(default=None)
    phone: Optional [str] = Field(default=None)
    email: Optional [str] = Field(default=None)
    instagram: Optional [str] = Field(default=None)
    twiter: Optional [str] = Field(default=None)
    tiktok: Optional [str] = Field(default=None)

class Estudiante(EstudianteBase, table=True):
    __tablename__ = "estudiante"
    est_id:int|None = Field(default=None, primary_key=True)
    equipo_id:int|None = Field(foreign_key="equipo.equipo_id")

class EquipoBase(SQLModel):
    name:str
    desc:str
    equipo_password:str
    evento_id:int

class EquipoEdit(SQLModel):
    name: Optional [str] = Field(default="")
    desc: Optional [str] = Field(default="")
    evento_id:Optional[int] = Field(default=None)


class Equipo(EquipoBase, table=True):
    __tablename__ = "equipo"
    equipo_id:int|None = Field(default=None, primary_key=True)
    evento_id:int|None = Field(foreign_key="event.evento_id")
