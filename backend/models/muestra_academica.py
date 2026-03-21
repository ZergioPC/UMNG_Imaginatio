from sqlmodel import SQLModel, Field
from typing import Optional

class MuestraAcademicaBase(SQLModel):
    title:str
    img:str = "uploads/users/idle.jpg"

class MuestraAcademicaEdit(SQLModel):
    title: Optional [str] = Field(default="")
    img: Optional [str] = Field(default=None) 

class MuestraAcademica(MuestraAcademicaBase, table=True):
    __tablename__ = "muestra_academica"
    muestra_id:int|None = Field(default=None, primary_key=True)
