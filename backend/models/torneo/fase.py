from sqlmodel import SQLModel, Field

class FaseBase(SQLModel):
    name:str
    order_number:int

class Fase(FaseBase, table=True):
    __tablename__ = "fase"
    id:int|None = Field(default=None, primary_key=True)