from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from app.config.settings import settings

# الرابط المباشر (تأكدي من كلمة السر 1734 واسم القاعدة Agri_DB)
DATABASE_URL = "postgresql://postgres:1734@localhost:5432/AgriDB"

engine = create_engine(
    DATABASE_URL, 
    echo=settings.DEBUG,
    connect_args={"client_encoding": "utf8"}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass

# دالة الحصول على الجلسة
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()