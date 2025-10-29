from fastapi import APIRouter, status

from models.events import EventBase, EventEdit, Event

from db import db_commit, db_select_all, db_select_unique, db_delete_unique, db_update

router = APIRouter()

# EVENTOS CRUD
@router.get("/get")
async def get_eventos():
    eventos = await db_select_all(Event)
    return {"data":eventos,"message":"Lista de Eventos"}

@router.get("/get/{id}")
async def get_evento_info(id:int):
    evento = await db_select_unique(Event,id)
    return {"data":evento,"message":"Info del evento"}

@router.post("/crear", status_code=status.HTTP_201_CREATED)
async def crear(event:EventBase):
    evento = Event.model_validate(event.model_dump())
    await db_commit(evento)
    return {"message":"Evento creado con Exito"}

@router.patch("/editar/{id}", status_code=status.HTTP_202_ACCEPTED)
async def editar(id:int, evento:EventEdit):
    data_dump = evento.model_dump(exclude_unset=True)
    # Se envía el modelo de la tabla (Event) y los datos del modelo de respuesta (EventEdit)
    await db_update(Event, id, data_dump)        
    return {"message":"Evento editado con Exito"}

@router.delete("/delete/{id}", status_code=status.HTTP_403_FORBIDDEN)
async def borrar(id:int):
    await db_delete_unique(Event,id)
    return {"message":"Evento eliminado con Exito"}

# GET EQUIPOS
@router.post("/{id}/post")
async def postear(id:int):
    return {"data":"Crear post del evento"}


@router.get("/{id}/equipos")
async def get_equipo_info(id:int):
    return {"data":f"Equipos del evento {id}"}
