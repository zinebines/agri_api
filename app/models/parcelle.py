from sqlalchemy import Column, Integer, Boolean, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from app.config.database import Base


class Parcelle(Base):
    __tablename__ = "parcelles"

    id = Column(Integer, primary_key=True, index=True)
    exploitation_id = Column(Integer, ForeignKey("exploitations.id", ondelete="CASCADE"))
    mode_exploitation_id = Column(Integer, ForeignKey("mode_exploitation.id"))
    statut_terre_id = Column(Integer, ForeignKey("statut_terre.id"))
    superficie = Column(Numeric(10, 2))
    acte_concession = Column(Boolean, default=False)
    nb_eac_exploitants = Column(Integer, default=0)
    nb_blocs = Column(Integer, default=1)
    bloc_unique = Column(Boolean, default=True)

    # Relationships
    exploitation = relationship("Exploitation", back_populates="parcelles")
    mode_exploitation = relationship("ModeExploitation", lazy="joined")
    statut_terre = relationship("StatutTerre", lazy="joined")


class SourceEnergie(Base):
    __tablename__ = "sources_energie"

    id = Column(Integer, primary_key=True, index=True)
    exploitation_id = Column(Integer, ForeignKey("exploitations.id", ondelete="CASCADE"))
    source_energie_type_id = Column(Integer, ForeignKey("source_energie_type.id"))

    exploitation = relationship("Exploitation", back_populates="sources_energie")
    source_energie_type = relationship("SourceEnergieType", lazy="joined")
