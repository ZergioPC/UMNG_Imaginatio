from sqlmodel import SQLModel, Field

class FutbolPlayerBase(SQLModel):
    name:str
    img_url:str

class FutbolPlayer(FutbolPlayerBase, table=True):
    __tablename__ = "futbol_player"
    id:int|None = Field(default=None, primary_key=True)
    equipo_id:int|None = Field(foreign_key="futbol_team.id")