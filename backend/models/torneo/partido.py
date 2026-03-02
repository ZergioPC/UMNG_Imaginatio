from sqlmodel import SQLModel, Field
from typing import Optional

class PartidoBase(SQLModel):
    equipo_1_score:int = 0
    equipo_2_score:int = 0
    fase_id:int|None = Field(foreign_key="fase.id")
    equipo_1:int|None = Field(foreign_key="futbol_team.id")
    equipo_2:int|None = Field(foreign_key="futbol_team.id")

class PartidoEdit(SQLModel):
    equipo_1_score: Optional[int] = Field(default=None)
    equipo_2_score: Optional[int] = Field(default=None)
    winner: Optional[int] = Field(default=None, foreign_key="futbol_team.id")

class Partido(PartidoBase, table=True):
    __tablename__ = "partido"
    id:int|None = Field(default=None, primary_key=True)
    winner:int|None = Field(default=None,foreign_key="futbol_team.id")