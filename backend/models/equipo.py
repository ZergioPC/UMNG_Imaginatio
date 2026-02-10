from sqlmodel import SQLModel, Field
from typing import Optional

class EquipoBase(SQLModel):
    name:str
    publicName:str
    desc:str
    img:str = "uploads/users/idle.jpg"
    equipo_password:str
    evento_id:int

class EquipoEdit(SQLModel):
    publicName: Optional [str] = Field(default="", max_length=25)
    desc: Optional [str] = Field(default="", max_length=250)
    img: Optional [str] = Field(default=None) 
    evento_id:Optional[int] = Field(default=None)

class Equipo(EquipoBase, table=True):
    __tablename__ = "equipo"
    equipo_id:int|None = Field(default=None, primary_key=True)
    evento_id:int|None = Field(foreign_key="event.evento_id")
