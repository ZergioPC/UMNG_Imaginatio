# TORNEO DE FUTBOL

Se quiere realizar un torneo de futbol 5 con selecciónes, donde los estudiantes se inscriben en grupos de a 6, y se les asignará un país para representar y un profesor que será anónimo hasta el día del evento.

## Diagrama Entidad Relación

```mermaid
---
title: Mapa Entidad Relación del Torneo
---
erDiagram

    Fases {
        int id PK
        int tournament_id FK
        string name
        int order_number
    }

    FutbolTeams {
        int id PK
        string name
        string logo_url
        id profesor_id
    }

    FutbolPlayers {
      int id PK
      string name
      string img_url
      int team_id FK
    }

    Partidos {
        int id PK
        int stage_id FK
        int team1_id FK
        int team2_id FK
        int team1_score
        int team2_score
        int winner_id FK
    }

    FutbolProfesor {
      int id PK
      string name
      string img_url
    }

    Fases ||--o{ Partidos : has
    Partidos ||--o{ FutbolTeams : has
    FutbolTeams ||--o{ FutbolPlayers : has 
    FutbolProfesor ||--|| FutbolTeams : has

```

## Diagrama de flujo del Backend

```mermaid

---
title: Sistema de Backend
---
flowchart LR

A1{Frontend Request}

A2[Get Data]
A3[Post Data]

A1 --> A2
A1 --> A3

subgraph Torneo
  E1[Get Fase]
  E2[Get Partidos]
  E1 --- E2
end

subgraph Equipos
  E3[Get Equipos]
  E31[Get Jugadores]
  E32[Get Profesor]

  E3 --> E31
  E3 --> E32
end

A2 --> Torneo
A2 --> Equipos

B[Crear Fase]
C[Agregar Partido]
D[Score del Partido]

A3 --> B
A3 --> C
A3 --> D

```