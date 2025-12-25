from sqlmodel import SQLModel, Field
from typing import Optional

class EquipoBase(SQLModel):
    name:str
    desc:str
    img:str = "uploads/users/idle.jpg"
    equipo_password:str
    evento_id:int

class EquipoEdit(SQLModel):
    name: Optional [str] = Field(default="")
    desc: Optional [str] = Field(default="")
    img: Optional [str] = Field(default=None) 
    evento_id:Optional[int] = Field(default=None)

class Equipo(EquipoBase, table=True):
    __tablename__ = "equipo"
    equipo_id:int|None = Field(default=None, primary_key=True)
    evento_id:int|None = Field(foreign_key="event.evento_id")
