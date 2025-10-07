# Diagrama de la Base de Datos

```mermaid
---
title: Imaginatio DB
---
classDiagram
    class Torneo{
        -int id
        +str name
        +str info
        +list Equipos
        +addEquipo()
        +editEquipo()
    }
    class Equipo{
        -int id
        +str name
        +str desc
        +int likes
        +list post
        +img foto
    }
    class Estudiante{
        -int id
        +str name
        +int codigo
        +int num_cel
        +str email
        +img foto
    }
    class Post{
        -int id
        +str titulo
        +str description
        +img foto
        +int likes
        +addLike()
    }
    Equipo <|-- Estudiante
    Equipo <|-- Post
    Torneo <|-- Equipo
    note "Cada Imaginatio se reinicia <br> la base de datos"
```