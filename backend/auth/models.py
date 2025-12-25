from pydantic import BaseModel
from sqlmodel import SQLModel, Field
from sqlalchemy import func, Column, DateTime
from datetime import datetime

class LoginRequest(BaseModel):
    name: str
    password: str

class AdminRequest(BaseModel):
    name: str
    password: str

class LoginResponse(BaseModel):
    message: str
    user: dict

class SessionList(SQLModel,table=True):
    __tablename__="SessionList"
    session_id:int = Field(default=None, primary_key=True)
    equipo_id:int
    token:str
    time:datetime = Field(
        sa_column=Column(
            DateTime(timezone=True),
            server_default=func.now(),
            nullable=False
        )
    )
