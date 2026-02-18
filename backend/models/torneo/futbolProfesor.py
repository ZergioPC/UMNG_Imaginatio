from sqlmodel import SQLModel, Field

class FutbolProfesorBase(SQLModel):
    name:str
    img_url:str

class FutbolProfesor(FutbolProfesorBase, table=True):
    __tablename__ = "futbol_profe"
    id:int|None = Field(default=None, primary_key=True)
    equipo_id:int|None = Field(foreign_key="futbol_team.id")