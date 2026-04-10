from sqlmodel import SQLModel, Field, Column, String, text, Integer
from typing import Optional

class MuestraAcademicaBase(SQLModel):
    title:str
    img:str = "uploads/users/idle.jpg"
    page:str = Field(
        default="#",
        sa_column=Column(String, nullable=False, server_default=text("'#'"))
    )
    order_index: int = Field(
        default=0,
        sa_column=Column(Integer, nullable=False, index=True, server_default="0")
    )

class MuestraAcademicaEdit(SQLModel):
    title: Optional [str] = Field(default="")
    img: Optional [str] = Field(default=None)
    page: Optional [str] = Field(default="")
    order_index: Optional [int] = Field(default=0)

class MuestraAcademicaIndexEdit(SQLModel):
    order_index: Optional [int] = Field(default=None)

class MuestraAcademica(MuestraAcademicaBase, table=True):
    __tablename__ = "muestra_academica"
    muestra_id:int|None = Field(default=None, primary_key=True)
