from dataclasses import dataclass, field
from datetime import date
from typing import Optional, List


@dataclass
class Campagne:
    """
    Model for table: recensement_campagne
    Aligned with the agri campagne system (nom_fr, nom_ar, annee, statut,
    desc_fr, desc_ar, wilayas, total_dossiers, valides).
    """

    id: Optional[int] = None

    nom_fr: str = ""

    nom_ar: str = ""

    annee: int = 0

    # ACTIF | CLOTURE | PREPARATION
    statut: str = "PREPARATION"

    date_debut: Optional[date] = None

    date_fin: Optional[date] = None

    desc_fr: str = ""

    desc_ar: str = ""

    # List of wilaya IDs (1-58) for territorial scope.
    # Empty list = national scope.
    wilayas: List[int] = field(default_factory=list)

    # Computed / denormalised counters (read-only from API, not stored directly)
    total_dossiers: int = 0
    valides: int = 0

    # ------------------------------------------------------------------
    # Serialisation
    # ------------------------------------------------------------------

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "nom_fr": self.nom_fr,
            "nom_ar": self.nom_ar,
            "annee": self.annee,
            "statut": self.statut,
            "date_debut": (
                self.date_debut.isoformat() if self.date_debut else None
            ),
            "date_fin": (
                self.date_fin.isoformat() if self.date_fin else None
            ),
            "desc_fr": self.desc_fr,
            "desc_ar": self.desc_ar,
            "wilayas": self.wilayas,
            "total_dossiers": self.total_dossiers,
            "valides": self.valides,
        }

    # ------------------------------------------------------------------
    # Deserialisation
    # ------------------------------------------------------------------

    @classmethod
    def from_dict(cls, data: dict) -> "Campagne":
        return cls(
            id=data.get("id"),
            nom_fr=data.get("nom_fr", ""),
            nom_ar=data.get("nom_ar", ""),
            annee=data.get("annee", 0),
            statut=data.get("statut", "PREPARATION"),
            date_debut=cls._parse_date(data.get("date_debut")),
            date_fin=cls._parse_date(data.get("date_fin")),
            desc_fr=data.get("desc_fr", ""),
            desc_ar=data.get("desc_ar", ""),
            wilayas=data.get("wilayas", []),
            total_dossiers=data.get("total_dossiers", 0),
            valides=data.get("valides", 0),
        )

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _parse_date(value) -> Optional[date]:
        """Accept a date object, an ISO string, or None."""
        if value is None:
            return None
        if isinstance(value, date):
            return value
        try:
            return date.fromisoformat(str(value))
        except (ValueError, TypeError):
            return None

    # ------------------------------------------------------------------
    # Status helpers
    # ------------------------------------------------------------------

    def is_active(self) -> bool:
        return self.statut == "ACTIF"

    def is_closed(self) -> bool:
        return self.statut == "CLOTURE"

    def completion_pct(self) -> int:
        """Percentage of validated dossiers (used by the progress bar)."""
        if not self.total_dossiers:
            return 0
        return round(self.valides / self.total_dossiers * 100)

    def __str__(self) -> str:
        return f"Campagne(id={self.id}, nom_fr={self.nom_fr!r}, annee={self.annee}, statut={self.statut})"