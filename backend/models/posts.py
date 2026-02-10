from sqlmodel import SQLModel, Field
from pydantic import BaseModel

class PostBase(SQLModel):
    title:str = Field(max_length=50)
    desc:str = Field(max_length=250)
    img:str

class Post(PostBase, table=True):
    __tablename__ = "post"
    post_id:int|None = Field(default=None, primary_key=True)
    equipo_id:int|None = Field(foreign_key="equipo.equipo_id")
    likes:int = 0

class PostWithEquipoResponse(BaseModel):
    post_id: int
    title: str
    desc: str
    img: str
    equipo_id: int
    likes: int
    equipo_name: str
    equipo_img: str | None

class PostsListResponse(BaseModel):
    data: list[PostWithEquipoResponse]
    message: str
    pages:int