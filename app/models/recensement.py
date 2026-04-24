from sqlalchemy import (
    Column, Integer, String, Date, ForeignKey,
    UniqueConstraint, Enum, Table, CheckConstraint
)
from sqlalchemy.orm import relationship
from app.config.database import Base


# ---------------------------------------------------------------------------
# Many-to-many: campagne  <-->  wilayas
# ---------------------------------------------------------------------------
campagne_wilayas = Table(
    "campagne_wilayas",
    Base.metadata,
    Column(
        "campagne_id",
        Integer,
        ForeignKey("recensement_campagne.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column(
        "wilaya_id",
        Integer,
        primary_key=True,
    ),
)


# ---------------------------------------------------------------------------
# Status lookup table (PREPARATION / ACTIF / CLOTURE)
# ---------------------------------------------------------------------------
class RecensementStatus(Base):
    __tablename__ = "recensement_status"

    id     = Column(Integer, primary_key=True)
    code   = Column(String(20), unique=True, nullable=False)   # PREPARATION | ACTIF | CLOTURE
    nom_fr = Column(String(50))
    nom_ar = Column(String(50))

    def __repr__(self):
        return f"<RecensementStatus code={self.code!r}>"


# ---------------------------------------------------------------------------
# Campagne
# ---------------------------------------------------------------------------
class RecensementCampagne(Base):
    __tablename__ = "recensement_campagne"

    id         = Column(Integer, primary_key=True, index=True)
    nom_fr     = Column(String(150), nullable=False)
    nom_ar     = Column(String(150))
    annee      = Column(Integer, nullable=False, unique=True)
    statut     = Column(
                    String(20),
                    nullable=False,
                    default="PREPARATION",
                 )
    date_debut = Column(Date)
    date_fin   = Column(Date)
    desc_fr    = Column(String(1000))
    desc_ar    = Column(String(1000))

    # Territorial scope: list of wilaya IDs.
    # Empty = national scope.
    wilayas = relationship(
        "Wilaya",
        secondary=campagne_wilayas,
        lazy="selectin",
    )

    recensements = relationship(
        "Recensement",
        back_populates="campagne",
        cascade="all, delete-orphan",
    )

    # ------------------------------------------------------------------
    # Computed helpers (NOT stored columns — derived at query time)
    # ------------------------------------------------------------------
    @property
    def total_dossiers(self) -> int:
        return len(self.recensements) if self.recensements else 0

    @property
    def valides(self) -> int:
        if not self.recensements:
            return 0
        return sum(
            1 for r in self.recensements
            if r.status and r.status.code == "VALIDE"
        )

    @property
    def completion_pct(self) -> int:
        if not self.total_dossiers:
            return 0
        return round(self.valides / self.total_dossiers * 100)

    def __repr__(self):
        return (
            f"<RecensementCampagne id={self.id} "
            f"nom_fr={self.nom_fr!r} annee={self.annee} statut={self.statut!r}>"
        )


# ---------------------------------------------------------------------------
# Recensement (individual dossier inside a campagne)
# ---------------------------------------------------------------------------
class Recensement(Base):
    __tablename__ = "recensements"

    id               = Column(Integer, primary_key=True, index=True)
    campagne_id      = Column(
                          Integer,
                          ForeignKey("recensement_campagne.id", ondelete="CASCADE"),
                          nullable=False,
                       )
    exploitation_id  = Column(
                          Integer,
                          ForeignKey("exploitations.id", ondelete="RESTRICT"),
                          nullable=False,
                       )
    recenseur_id     = Column(
                          Integer,
                          ForeignKey("users.id", ondelete="SET NULL"),
                          nullable=True,
                       )
    controleur_id    = Column(
                          Integer,
                          ForeignKey("users.id", ondelete="SET NULL"),
                          nullable=True,
                       )
    date_recensement = Column(Date)
    date_controle    = Column(Date)
    status_id        = Column(
                          Integer,
                          ForeignKey("recensement_status.id"),
                          nullable=True,
                       )

    __table_args__ = (
        UniqueConstraint(
            "campagne_id", "exploitation_id",
            name="unique_recensement_par_campagne",
        ),
    )

    # Relationships
    campagne    = relationship("RecensementCampagne", back_populates="recensements")
    exploitation = relationship("Exploitation", lazy="joined")
    status      = relationship("RecensementStatus", lazy="joined")

    # recenseur & controleur both point to the users table.
    # foreign_keys specified explicitly because two FKs target the same table.
    recenseur   = relationship(
                     "User",
                     foreign_keys=[recenseur_id],
                     lazy="select",
                  )
    controleur  = relationship(
                     "User",
                     foreign_keys=[controleur_id],
                     lazy="select",
                  )

    def __repr__(self):
        return (
            f"<Recensement id={self.id} "
            f"campagne_id={self.campagne_id} "
            f"exploitation_id={self.exploitation_id} "
            f"status={self.status.code if self.status else None!r}>"
        )