from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import Optional

from app.models.recensement import Recensement, RecensementCampagne, RecensementStatus
from app.models.exploitation import Exploitation
from app.schemas.recensement_schema import (
    RecensementCreate, RecensementUpdate,
    CampagneCreate, CampagneUpdate,
    RecensementChangeStatus,
)


# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────

def _get_or_404(db: Session, model, item_id: int):
    obj = db.get(model, item_id)
    if not obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{model.__tablename__} id={item_id} introuvable"
        )
    return obj


# ─────────────────────────────────────────────────────────────────────────────
# RecensementStatus  (read-only, données fixes)
# ─────────────────────────────────────────────────────────────────────────────

def list_status(db: Session):
    return db.query(RecensementStatus).all()


# ─────────────────────────────────────────────────────────────────────────────
# RecensementCampagne
# ─────────────────────────────────────────────────────────────────────────────

def list_campagnes(db: Session) -> list[RecensementCampagne]:
    return db.query(RecensementCampagne).order_by(RecensementCampagne.annee.desc()).all()


def get_campagne(db: Session, campagne_id: int) -> RecensementCampagne:
    return _get_or_404(db, RecensementCampagne, campagne_id)


def create_campagne(db: Session, data: CampagneCreate) -> RecensementCampagne:
    existing = db.query(RecensementCampagne).filter(
        RecensementCampagne.annee == data.annee
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Une campagne pour l'année {data.annee} existe déjà"
        )
    campagne = RecensementCampagne(**data.model_dump())
    db.add(campagne)
    db.commit()
    db.refresh(campagne)
    return campagne


def update_campagne(db: Session, campagne_id: int, data: CampagneUpdate) -> RecensementCampagne:
    campagne = _get_or_404(db, RecensementCampagne, campagne_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(campagne, field, value)
    db.commit()
    db.refresh(campagne)
    return campagne


def delete_campagne(db: Session, campagne_id: int) -> None:
    campagne = _get_or_404(db, RecensementCampagne, campagne_id)
    has_recensements = db.query(Recensement).filter(
        Recensement.campagne_id == campagne_id
    ).first()
    if has_recensements:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Impossible de supprimer une campagne qui contient des recensements"
        )
    db.delete(campagne)
    db.commit()


# ─────────────────────────────────────────────────────────────────────────────
# Recensement
# ─────────────────────────────────────────────────────────────────────────────

def list_recensements(
    db: Session,
    skip: int = 0,
    limit: int = 50,
    campagne_id: Optional[int] = None,
    status_id: Optional[int] = None,
    recenseur_id: Optional[int] = None,
) -> list[Recensement]:
    q = db.query(Recensement)
    if campagne_id:
        q = q.filter(Recensement.campagne_id == campagne_id)
    if status_id:
        q = q.filter(Recensement.status_id == status_id)
    if recenseur_id:
        q = q.filter(Recensement.recenseur_id == recenseur_id)
    return q.offset(skip).limit(limit).all()


def get_recensement(db: Session, recensement_id: int) -> Recensement:
    return _get_or_404(db, Recensement, recensement_id)


def create_recensement(db: Session, data: RecensementCreate) -> Recensement:
    # Vérifier que la campagne existe
    _get_or_404(db, RecensementCampagne, data.campagne_id)

    # Vérifier que l'exploitation existe
    if not db.get(Exploitation, data.exploitation_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Exploitation id={data.exploitation_id} introuvable"
        )

    # Contrainte UNIQUE(campagne_id, exploitation_id)
    existing = db.query(Recensement).filter(
        Recensement.campagne_id == data.campagne_id,
        Recensement.exploitation_id == data.exploitation_id,
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cette exploitation est déjà recensée dans cette campagne"
        )

    # Statut par défaut = 1 (En cours) si non fourni
    payload = data.model_dump()
    if not payload.get("status_id"):
        payload["status_id"] = 1

    recensement = Recensement(**payload)
    db.add(recensement)
    db.commit()
    db.refresh(recensement)
    return recensement


def update_recensement(db: Session, recensement_id: int, data: RecensementUpdate) -> Recensement:
    recensement = _get_or_404(db, Recensement, recensement_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(recensement, field, value)
    db.commit()
    db.refresh(recensement)
    return recensement


def change_status(
    db: Session,
    recensement_id: int,
    data: RecensementChangeStatus
) -> Recensement:
    recensement = _get_or_404(db, Recensement, recensement_id)

    # Vérifier que le status_id est valide
    if not db.get(RecensementStatus, data.status_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"status_id={data.status_id} invalide"
        )

    recensement.status_id = data.status_id
    db.commit()
    db.refresh(recensement)
    return recensement


def delete_recensement(db: Session, recensement_id: int) -> None:
    recensement = _get_or_404(db, Recensement, recensement_id)
    db.delete(recensement)
    db.commit()
