# Diagrama de Requisitos de la APP

## General

Descripción básica del funcionamiento  esperado del sitio web del **Imaginatio.**

```mermaid
---
title: Imaginatio Workflow
config:
  flowchart:
    curve: stepBefore
---
flowchart LR
    Y(Visitante) --> A
    Z(Equipo) --> B
    X(Admin) --> C
    subgraph Web
        direction TB
        A[Home View]
        B[Teams View]
        C[Admin View]
    end
    subgraph API
        direction TB
        D[Dar Like]
        E[Publicar Post]
        F["Ver Likes"]
    end
    B-->E
    A-->D
    C-->F
    W@{ shape: cyl, label: "Base de Datos" }
    D-->W
    E-->W
    F-->W
    
```

## Visitantes

Mapa mental de lo que necesitan ver los visitantes e interesados en el Imaginatio

```mermaid
---
title: Imaginatio  - Visitante Features
---
mindmap
  ((Visitantes))
    {{Feed}}
        Post de equipos
        Post del evento
        Filtrar por Torneo
    {{Edicion Actual}}
        Enlace web oficial
        Info del Evento
    {{Información}}
        Qué es
        Quiénes organizan
    {{Otras ediciones}}
        Páginas Web
        Publicaciones
        Sites de Multimedia
```

## Equipos

Mapa mental de lo que necesitan los equipos que participen en el Imaginatio

```mermaid
---
title: Imaginatio  - Equipo Features
---
mindmap
  ((Equipos))
    {{Integrantes}}
        nombres
        contacto
    {{Publicaciones}}
        titulo
        descripcion
        foto
```

## Admin

Mapa mental de lo necesario para la vista Admin

```mermaid
---
title: Imaginatio  - Admin Features
---
mindmap
  ((Admin))
    {{Control Equipos}}
        Editar
        Agregar
    {{Estadisticas}}
        Vistas e Interacción
        Conteo de Likes
```