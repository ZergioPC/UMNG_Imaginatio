import os
from dotenv import load_dotenv

from sqlmodel import Session, SQLModel, create_engine, select
from fastapi import FastAPI, HTTPException, status

from models.equipo import *
from models.events import *
from models.posts import *

load_dotenv()

DB_URL:str = os.getenv("DB_URL")
engine = create_engine(DB_URL)

def crear_tablas(app:FastAPI):
    SQLModel.metadata.create_all(engine)
    yield

# functions to controll the DB access from the endpoints
# Always use with!!
async def db_select_all(model):
    """
    This function creates a SESSION to get 
    data to DB
    """
    with Session(engine) as session:
        data = session.exec(select(model))
        return data.all()
    
async def db_select_range(model, delta, limite):
    """
    This function creates a SESSION to get 
    data to DB
    """
    with Session(engine) as session:
        query = select(model).offset(delta).limit(limite)
        data = session.exec(query).all()
        return data
    
async def db_select_unique(model, id):
    """
    This function creates a SESSION to get 
    only one data to DB
    """
    with Session(engine) as session:
        data = session.get(model, id)
        if not data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Elemento no encontrado")
        return data
    
async def db_select_query(query):
    """
    This function executes a query
    """
    with Session(engine) as session:
        data = session.exec(query).all()
        if not data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Elemento no encontrado")
        return data

async def db_commit(model):
    """
    This function creates a SESSION to send
    data to DB
    """
    with Session(engine) as session:
        session.add(model)
        session.commit()

async def db_update(model, id, data):
    with Session(engine) as session:
        modelo = session.get(model, id)
        
        if not modelo:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Elemento no encontrado")
        
        #Guardar los cambios en la base de datos
        for key, value in data.items():        
             setattr(modelo, key, value)     
        
        modelo.sqlmodel_update(data)
        session.add(modelo)
        session.commit()

async def db_delete_unique(model, id):
    """
    This function creates a SESSION to get 
    only one data to DB
    """
    with Session(engine) as session:
        data = session.get(model, id)
        
        if not data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Elemento no encontrado")
        
        session.delete(data)
        session.commit()