from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import Optional

from app.models.parcelle import Parcelle
from app.models.exploitation import Exploitation
from app.schemas.parcelle_schema import ParcelleCreate, ParcelleUpdate


def get_parcelle_or_404(db: Session, parcelle_id: int) -> Parcelle:
    parcelle = db.get(Parcelle, parcelle_id)
    if not parcelle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Parcelle with id={parcelle_id} not found"
        )
    return parcelle


def list_parcelles(
    db: Session,
    skip: int = 0,
    limit: int = 50,
    exploitation_id: Optional[int] = None,
) -> list[Parcelle]:
    query = db.query(Parcelle)
    if exploitation_id:
        query = query.filter(Parcelle.exploitation_id == exploitation_id)
    return query.offset(skip).limit(limit).all()


def get_parcelle(db: Session, parcelle_id: int) -> Parcelle:
    return get_parcelle_or_404(db, parcelle_id)


def create_parcelle(db: Session, data: ParcelleCreate) -> Parcelle:
    if not db.get(Exploitation, data.exploitation_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Exploitation with id={data.exploitation_id} not found"
        )
    parcelle = Parcelle(**data.model_dump())
    db.add(parcelle)
    db.commit()
    db.refresh(parcelle)
    return parcelle


def update_parcelle(db: Session, parcelle_id: int, data: ParcelleUpdate) -> Parcelle:
    parcelle = get_parcelle_or_404(db, parcelle_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(parcelle, field, value)
    db.commit()
    db.refresh(parcelle)
    return parcelle


def delete_parcelle(db: Session, parcelle_id: int) -> None:
    parcelle = get_parcelle_or_404(db, parcelle_id)
    db.delete(parcelle)
    db.commit()
