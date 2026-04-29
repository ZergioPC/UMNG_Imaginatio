from sqlmodel import SQLModel, Field, Column, String, text, Integer
from typing import Optional

class InvitadosBase(SQLModel):
    nombre:str
    desc:str
    img:str = "uploads/users/idle.jpg"
    order_index: int = Field(
        default=0,
        sa_column=Column(Integer, nullable=False, index=True, server_default="0")
    )

class InvitadosEdit(SQLModel):
    nombre: Optional [str] = Field(default="")
    desc: Optional [str] = Field(default="")
    img: Optional [str] = Field(default=None)
    order_index: Optional [int] = Field(default=0)

class InvitadosIndexEdit(SQLModel):
    order_index: Optional [int] = Field(default=None)

class Invitados(InvitadosBase, table=True):
    __tablename__ = "invitados"
    invitado_id:int|None = Field(default=None, primary_key=True)
