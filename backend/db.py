import os
import asyncio
import logging
from dotenv import load_dotenv

from sqlmodel import SQLModel, select
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine, AsyncEngine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import OperationalError
from fastapi import FastAPI, HTTPException, status

from models.equipo import *
from models.events import *
from models.posts import *

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get DB_URL from environment variable
DB_URL: str = os.getenv("DB_URL")

if not DB_URL:
    raise ValueError("DB_URL environment variable is not set")

logger.info(f"Database URL: {DB_URL.replace(DB_URL.split('@')[0].split('//')[1], '***:***')}")

# Create async engine
engine: AsyncEngine = create_async_engine(
    DB_URL,
    echo=False,  # Set to True for SQL debugging
    future=True,
    pool_pre_ping=True,
)

# Create async session maker
async_session = sessionmaker(
    engine, 
    class_=AsyncSession, 
    expire_on_commit=False
)


async def wait_for_db(max_retries: int = 30, delay: int = 2):
    """Wait for database to be ready with retry logic"""
    for attempt in range(max_retries):
        try:
            logger.info(f"Attempting database connection (attempt {attempt + 1}/{max_retries})...")
            async with engine.connect() as conn:
                await conn.execute(select(1))
            logger.info("Database connection established successfully!")
            return True
        except (OperationalError, ConnectionRefusedError, OSError) as e:
            logger.warning(f"Database connection failed: {str(e)[:100]}")
            if attempt < max_retries - 1:
                logger.info(f"Retrying in {delay} seconds...")
                await asyncio.sleep(delay)
            else:
                logger.error("Could not connect to database after maximum retries")
                raise Exception("Database connection failed after multiple attempts")
    return False


async def crear_tablas(app: FastAPI):
    """Create all tables asynchronously with retry logic"""
    logger.info("🚀 Starting database initialization...")
    
    # Wait for database to be ready
    await wait_for_db()
    
    # Create tables
    logger.info("📊 Creating database tables...")
    try:
        async with engine.begin() as conn:
            await conn.run_sync(SQLModel.metadata.create_all)
        logger.info("Database tables created successfully!")
    except Exception as e:
        logger.error(f"Error creating tables: {e}")
        raise
    
    yield
    
    # Cleanup on shutdown
    logger.info("🔌 Closing database connections...")
    await engine.dispose()


# Dependency to get async session
async def get_session():
    """Dependency for getting async database sessions"""
    async with async_session() as session:
        yield session


# Functions to control the DB access from the endpoints

async def db_select_all(model):
    """Get all records from a table"""
    async with async_session() as session:
        statement = select(model)
        result = await session.execute(statement)
        return result.scalars().all()


async def db_select_range(model, delta, limite):
    """Get paginated records from a table"""
    async with async_session() as session:
        query = select(model).offset(delta).limit(limite)
        result = await session.execute(query)
        return result.scalars().all()


async def db_select_unique(model, id):
    """Get a single record by ID"""
    async with async_session() as session:
        data = await session.get(model, id)
        if not data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Elemento no encontrado"
            )
        return data


async def db_select_query(query):
    """
    Execute a custom query

    Args:
        query (select) : Consulta SQL

    Returns:
        list[SQLModel]
    
    """
    async with async_session() as session:
        result = await session.execute(query)
        data = result.scalars().all()
        if not data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Elemento no encontrado"
            )
        return data


async def db_commit(model):
    """Insert a new record"""
    async with async_session() as session:
        session.add(model)
        await session.commit()
        await session.refresh(model)
        return model


async def db_update(model, id, data):
    """Update a record by ID"""
    async with async_session() as session:
        modelo = await session.get(model, id)
        
        if not modelo:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Elemento no encontrado"
            )
        
        # Update fields
        for key, value in data.items():
            setattr(modelo, key, value)
        
        session.add(modelo)
        await session.commit()
        await session.refresh(modelo)
        return modelo


async def db_delete_unique(model, id):
    """Delete a record by ID"""
    async with async_session() as session:
        data = await session.get(model, id)
        
        if not data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Elemento no encontrado"
            )
        
        await session.delete(data)
        await session.commit()


async def db_get_equipo_by_name(name: str) -> Equipo:
    """Get an Equipo by name"""
    async with async_session() as session:
        statement = select(Equipo).where(Equipo.name == name)
        result = await session.execute(statement)
        equipo = result.scalar_one_or_none()
        return equipo