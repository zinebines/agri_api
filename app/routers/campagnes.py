from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from pydantic import BaseModel

from app.config.database import get_db
from app.models.recensement import RecensementCampagne as Campagne, campagne_wilayas, Recensement

router = APIRouter(prefix="/campagnes", tags=["Campagnes"])


# ─── Schemas Pydantic ─────────────────────────────────────────

class CampagneCreate(BaseModel):
    nom_fr:     str
    nom_ar:     Optional[str] = ""
    annee:      int
    statut:     Optional[str] = "PREPARATION"
    date_debut: Optional[date] = None
    date_fin:   Optional[date] = None
    desc_fr:    Optional[str] = ""
    desc_ar:    Optional[str] = ""
    wilayas:    Optional[List[int]] = []   # liste IDs wilayas


class CampagneUpdate(BaseModel):
    nom_fr:     Optional[str] = None
    nom_ar:     Optional[str] = None
    statut:     Optional[str] = None
    date_debut: Optional[date] = None
    date_fin:   Optional[date] = None
    desc_fr:    Optional[str] = None
    desc_ar:    Optional[str] = None
    wilayas:    Optional[List[int]] = None


class CampagneStatut(BaseModel):
    statut: str


class CampagneOut(BaseModel):
    id:             int
    nom_fr:         str
    nom_ar:         Optional[str]
    annee:          int
    statut:         str
    date_debut:     Optional[date]
    date_fin:       Optional[date]
    desc_fr:        Optional[str]
    desc_ar:        Optional[str]
    wilayas:        List[int] = []
    total_dossiers: int = 0
    valides:        int = 0

    class Config:
        from_attributes = True


# ─── Helper : convertir Campagne → CampagneOut ───────────────

def _to_out(c: Campagne, db: Session) -> CampagneOut:
    # جلب معرفات الولايات المرتبطة
    wilayas_ids = [w.id for w in c.wilayas] if c.wilayas else []
    
    # حساب الإحصائيات من جدول recensements
    total_dossiers = db.query(Recensement).filter(
        Recensement.campagne_id == c.id
    ).count()
    
    # حساب الملفات التي تم قبولها (status_id = 4)
    valides = db.query(Recensement).filter(
        Recensement.campagne_id == c.id,
        Recensement.status_id == 4
    ).count()

    return CampagneOut(
        id=c.id, 
        nom_fr=c.nom_fr, 
        nom_ar=c.nom_ar,
        annee=c.annee, 
        statut=c.statut,
        date_debut=c.date_debut, 
        date_fin=c.date_fin,
        desc_fr=c.desc_fr,
        desc_ar=c.desc_ar,
        wilayas=wilayas_ids,
        total_dossiers=total_dossiers,
        valides=valides,
    )

def _sync_wilayas(db: Session, campagne_id: int, wilaya_ids: List[int]):
    """Remplace les wilayas de la campagne par la nouvelle liste."""
    db.execute(
        campagne_wilayas.delete().where(
            campagne_wilayas.c.campagne_id == campagne_id
        )
    )
    if wilaya_ids:
        db.execute(
            campagne_wilayas.insert(),
            [{"campagne_id": campagne_id, "wilaya_id": wid} for wid in wilaya_ids]
        )


def _get_or_404(db: Session, id: int) -> Campagne:
    c = db.get(Campagne, id)
    if not c:
        raise HTTPException(status_code=404, detail="Campagne introuvable")
    return c


def _validate_statut(statut: Optional[str]):
    if statut and statut not in {"PREPARATION", "ACTIF", "CLOTURE"}:
        raise HTTPException(status_code=400,
            detail="Statut invalide. Valeurs: PREPARATION | ACTIF | CLOTURE")


# ─── Routes ──────────────────────────────────────────────────

@router.get("/", response_model=List[CampagneOut])
def list_campagnes(db: Session = Depends(get_db)):
    campagnes = db.query(Campagne).order_by(Campagne.annee.desc()).all()
    return [_to_out(c, db) for c in campagnes]


@router.post("/", response_model=CampagneOut, status_code=status.HTTP_201_CREATED)
def create_campagne(payload: CampagneCreate, db: Session = Depends(get_db)):
    _validate_statut(payload.statut)

    if db.query(Campagne).filter(Campagne.annee == payload.annee).first():
        raise HTTPException(status_code=409,
            detail=f"Une campagne pour l'année {payload.annee} existe déjà")

    data = payload.model_dump(exclude={"wilayas"})
    c = Campagne(**data)
    db.add(c)
    db.flush()  # obtenir c.id avant de créer les wilayas
    _sync_wilayas(db, c.id, payload.wilayas or [])
    db.commit()
    db.refresh(c)
    return _to_out(c, db)


@router.get("/{id}", response_model=CampagneOut)
def get_campagne(id: int, db: Session = Depends(get_db)):
    return _to_out(_get_or_404(db, id), db)


@router.put("/{id}", response_model=CampagneOut)
def update_campagne(id: int, payload: CampagneUpdate, db: Session = Depends(get_db)):
    c = _get_or_404(db, id)
    data = payload.model_dump(exclude_unset=True, exclude={"wilayas"})
    for field, value in data.items():
        setattr(c, field, value)
    if payload.wilayas is not None:
        _sync_wilayas(db, c.id, payload.wilayas)
    db.commit()
    db.refresh(c)
    return _to_out(c, db)


@router.patch("/{id}/statut", response_model=CampagneOut)
def update_statut(id: int, payload: CampagneStatut, db: Session = Depends(get_db)):
    _validate_statut(payload.statut)
    if payload.statut == "ACTIF":
        db.query(Campagne).filter(Campagne.id != id, Campagne.statut == "ACTIF")\
            .update({"statut": "PREPARATION"})
    c = _get_or_404(db, id)
    c.statut = payload.statut
    db.commit()
    db.refresh(c)
    return _to_out(c, db)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_campagne(id: int, db: Session = Depends(get_db)):
    c = _get_or_404(db, id)
    if db.query(Recensement).filter(Recensement.campagne_id == id).first():
        raise HTTPException(status_code=409,
            detail="Impossible de supprimer une campagne qui contient des recensements")
    db.delete(c)
    db.commit()