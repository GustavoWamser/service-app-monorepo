from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.database.base import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    senha_hash = Column(String, nullable=False)
    is_admin = Column(Boolean, default=False, nullable=False)
    criado_em = Column(DateTime(timezone=True), server_default=func.now())