from sqlmodel import SQLModel, Field, Column, String, text
from typing import Optional

class MuestraAcademicaBase(SQLModel):
    title:str
    img:str = "uploads/users/idle.jpg"
    page: str = Field(
        default="#",
        sa_column=Column(String, nullable=False, server_default=text("'#'"))
    )

class MuestraAcademicaEdit(SQLModel):
    title: Optional [str] = Field(default="")
    img: Optional [str] = Field(default=None)
    page: Optional [str] = Field(default="") 

class MuestraAcademica(MuestraAcademicaBase, table=True):
    __tablename__ = "muestra_academica"
    muestra_id:int|None = Field(default=None, primary_key=True)
