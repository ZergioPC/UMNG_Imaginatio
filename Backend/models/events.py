from sqlmodel import SQLModel, Field
from typing import Optional

class EventBase(SQLModel):
    name:str
    desc:str

class EventEdit(SQLModel):
    name: Optional [str] = Field(default=None)
    desc: Optional [str] = Field(default=None)

class Event(EventBase, table=True):
    __tablename__ = "event"
    evento_id:int = Field(default=None, primary_key=True)