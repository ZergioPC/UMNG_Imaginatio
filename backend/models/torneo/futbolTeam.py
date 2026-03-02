from sqlmodel import SQLModel, Field

class FutbolTeamBase(SQLModel):
    name:str

class FutbolTeam(FutbolTeamBase, table=True):
    __tablename__ = "futbol_team"
    id:int|None = Field(default=None, primary_key=True)
    fulled:bool = False
    hasProfesor:bool = False