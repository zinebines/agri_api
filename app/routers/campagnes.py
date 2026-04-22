from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from pydantic import BaseModel

from app.config.database import get_db

router = APIRouter(prefix="/campagnes", tags=["Campagnes"])

# ─── Schemas Pydantic ─────────────────────────────────────────

class CampagneCreate(BaseModel):
    nom_fr: str
    nom_ar: Optional[str] = ""
    annee: int
    statut: Optional[str] = "PREPARATION"  # PREPARATION | ACTIF | CLOTURE
    date_debut: Optional[date] = None
    date_fin: Optional[date] = None
    description_fr: Optional[str] = ""
    description_ar: Optional[str] = ""
    wilayas: Optional[List[int]] = []

class CampagneUpdate(CampagneCreate):
    pass

class CampagneStatut(BaseModel):
    statut: str  # PREPARATION | ACTIF | CLOTURE

class CampagneOut(BaseModel):
    id: int
    nom_fr: str
    nom_ar: Optional[str]
    annee: int
    statut: str
    date_debut: Optional[date]
    date_fin: Optional[date]
    description_fr: Optional[str]
    description_ar: Optional[str]
    wilayas: Optional[List[int]]
    total_dossiers: Optional[int] = 0
    valides: Optional[int] = 0

    class Config:
        from_attributes = True


# ─── NOTE: Remplacez les fonctions ci-dessous par votre ORM réel ──
# Ces fonctions utilisent un stockage en mémoire temporaire.
# Connectez-les à votre modèle SQLAlchemy (app.models.Campagne).

_campagnes_db: List[dict] = []
_next_id = {"v": 1}


def _get_all():
    return _campagnes_db

def _get_by_id(id: int):
    return next((c for c in _campagnes_db if c["id"] == id), None)


# ─── Routes ──────────────────────────────────────────────────

@router.get("/", response_model=List[CampagneOut])
def list_campagnes(db: Session = Depends(get_db)):
    """Retourne toutes les campagnes."""
    # TODO: remplacer par → db.query(Campagne).all()
    return _get_all()


@router.post("/", response_model=CampagneOut, status_code=status.HTTP_201_CREATED)
def create_campagne(payload: CampagneCreate, db: Session = Depends(get_db)):
    """Crée une nouvelle campagne."""
    # TODO: remplacer par → obj = Campagne(**payload.dict()); db.add(obj); db.commit()
    new = {"id": _next_id["v"], **payload.dict(), "total_dossiers": 0, "valides": 0}
    _next_id["v"] += 1
    _campagnes_db.append(new)
    return new


@router.get("/{id}", response_model=CampagneOut)
def get_campagne(id: int, db: Session = Depends(get_db)):
    """Retourne une campagne par ID."""
    c = _get_by_id(id)
    if not c:
        raise HTTPException(status_code=404, detail="Campagne introuvable")
    return c


@router.put("/{id}", response_model=CampagneOut)
def update_campagne(id: int, payload: CampagneUpdate, db: Session = Depends(get_db)):
    """Modifie une campagne existante."""
    c = _get_by_id(id)
    if not c:
        raise HTTPException(status_code=404, detail="Campagne introuvable")
    c.update(payload.dict())
    return c


@router.patch("/{id}/statut", response_model=CampagneOut)
def update_statut(id: int, payload: CampagneStatut, db: Session = Depends(get_db)):
    """Change le statut d'une campagne (PREPARATION / ACTIF / CLOTURE)."""
    allowed = {"PREPARATION", "ACTIF", "CLOTURE"}
    if payload.statut not in allowed:
        raise HTTPException(status_code=400, detail=f"Statut invalide. Valeurs: {allowed}")
    # Si on active une campagne, désactiver les autres
    if payload.statut == "ACTIF":
        for other in _campagnes_db:
            if other["id"] != id and other.get("statut") == "ACTIF":
                other["statut"] = "PREPARATION"
    c = _get_by_id(id)
    if not c:
        raise HTTPException(status_code=404, detail="Campagne introuvable")
    c["statut"] = payload.statut
    return c


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_campagne(id: int, db: Session = Depends(get_db)):
    """Supprime une campagne."""
    global _campagnes_db
    c = _get_by_id(id)
    if not c:
        raise HTTPException(status_code=404, detail="Campagne introuvable")
    _campagnes_db = [x for x in _campagnes_db if x["id"] != id]
    return None