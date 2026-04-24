from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import Optional

from app.models.recensement import Recensement, RecensementStatus, RecensementCampagne as Campagne
from app.models.exploitation import Exploitation
from app.schemas.recensement_schema import (
    RecensementCreate, RecensementUpdate,
    RecensementChangeStatus,
)


# ─────────────────────────────────────────────────────────────────────────────
# Helper générique
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
# RecensementStatus  (référentiel — lecture seule)
# ─────────────────────────────────────────────────────────────────────────────

def list_status(db: Session):
    return db.query(RecensementStatus).all()


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
    controleur_id: Optional[int] = None,
    exploitation_id: Optional[int] = None,
) -> list[Recensement]:
    q = db.query(Recensement)
    if campagne_id:
        q = q.filter(Recensement.campagne_id == campagne_id)
    if status_id:
        q = q.filter(Recensement.status_id == status_id)
    if recenseur_id:
        q = q.filter(Recensement.recenseur_id == recenseur_id)
    if controleur_id:
        q = q.filter(Recensement.controleur_id == controleur_id)
    if exploitation_id:
        q = q.filter(Recensement.exploitation_id == exploitation_id)
    return q.offset(skip).limit(limit).all()


def get_recensement(db: Session, recensement_id: int) -> Recensement:
    return _get_or_404(db, Recensement, recensement_id)


def create_recensement(db: Session, data: RecensementCreate) -> Recensement:
    # Vérifier que la campagne existe
    _get_or_404(db, Campagne, data.campagne_id)

    # Vérifier que l'exploitation existe
    _get_or_404(db, Exploitation, data.exploitation_id)

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


def change_status(db: Session, recensement_id: int, data: RecensementChangeStatus) -> Recensement:
    recensement = _get_or_404(db, Recensement, recensement_id)
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