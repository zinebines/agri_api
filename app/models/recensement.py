from sqlalchemy import Column, Integer, String, Date, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.config.database import Base


class RecensementStatus(Base):
    __tablename__ = "recensement_status"

    id = Column(Integer, primary_key=True)
    nom_fr = Column(String(50))
    nom_ar = Column(String(50))


class RecensementCampagne(Base):
    __tablename__ = "recensement_campagne"

    id = Column(Integer, primary_key=True, index=True)
    nom_fr = Column(String(150), nullable=False)
    nom_ar = Column(String(150))
    annee = Column(Integer, nullable=False, unique=True)
    date_debut = Column(Date)
    date_fin = Column(Date)

    recensements = relationship("Recensement", back_populates="campagne")


class Recensement(Base):
    __tablename__ = "recensements"

    id = Column(Integer, primary_key=True, index=True)
    campagne_id = Column(Integer, ForeignKey("recensement_campagne.id"), nullable=False)
    exploitation_id = Column(Integer, ForeignKey("exploitations.id"), nullable=False)
    recenseur_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    controleur_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    date_recensement = Column(Date)
    date_controle = Column(Date)
    status_id = Column(Integer, ForeignKey("recensement_status.id"))

    __table_args__ = (
        UniqueConstraint("campagne_id", "exploitation_id", name="unique_recensement"),
    )

    # Relationships
    campagne = relationship("RecensementCampagne", back_populates="recensements")
    exploitation = relationship("Exploitation", lazy="joined")
    status = relationship("RecensementStatus", lazy="joined")
    # recenseur & controleur pointent vers users — lazy load pour éviter la circularité
    # (la table users sera gérée par le module auth, on ne la mappe pas encore)
