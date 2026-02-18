from sqlmodel import SQLModel, Field

class PartidoBase(SQLModel):
    equipo_1_score:int = 0
    equipo_2_score:int = 0
    fase_id:int|None = Field(foreign_key="fase.id")
    equipo_1:int|None = Field(foreign_key="futbol_team.id")
    equipo_2:int|None = Field(foreign_key="futbol_team.id")

class Partido(PartidoBase, table=True):
    __tablename__ = "partido"
    id:int|None = Field(default=None, primary_key=True)
    winner:int|None = Field(default=None,foreign_key="futbol_team.id")