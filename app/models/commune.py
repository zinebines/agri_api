from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.config.database import Base


class Commune(Base):
    __tablename__ = "communes"

    id = Column(Integer, primary_key=True, index=True)
    wilaya_id = Column(Integer, ForeignKey("wilayas.id", ondelete="CASCADE"), nullable=False)
    nom_fr = Column(String(150), nullable=False)
    nom_ar = Column(String(150))

    wilaya = relationship("Wilaya", lazy="joined")
    exploitations = relationship("Exploitation", back_populates="commune")
