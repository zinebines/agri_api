# app/config/database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from app.config.settings import settings
DATABASE_URL = "postgresql://postgres:1734@localhost:5432/AgriDB?client_encoding=utf8"

engine = create_engine(
    DATABASE_URL,
    echo=settings.DEBUG,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()