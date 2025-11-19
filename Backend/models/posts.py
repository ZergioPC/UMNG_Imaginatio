from sqlmodel import SQLModel, Field

class PostBase(SQLModel):
    title:str
    desc:str
    img:str

class Post(PostBase, table=True):
    __tablename__ = "post"
    post_id:int|None = Field(default=None, primary_key=True)
    equipo_id:int|None = Field(foreign_key="equipo.equipo_id")
    likes:int = 0