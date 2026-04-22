"""
Minimal users table — sert uniquement de cible pour les FK
recenseur_id / controleur_id dans la table recensements.

Le module d'authentification complet (login, hashing, JWT…)
sera ajouté dans un module séparé. Ce modèle peut être enrichi
sans toucher au reste du projet.
"""
from sqlalchemy import Column, Integer, String, Boolean
from app.config.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False)
    email = Column(String(150), unique=True)
    full_name = Column(String(200))
    hashed_password = Column(String(255))
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
