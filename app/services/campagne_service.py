from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import Optional

from app.models.recensement import RecensementCampagne as Campagne, campagne_wilayas, Recensement
from app.schemas.recensement_schema import (
    CampagneCreate,
    CampagneUpdate,
)


def _get_or_404(db: Session, campagne_id: int) -> Campagne:
    campagne = db.get(Campagne, campagne_id)
    if not campagne:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Campagne id={campagne_id} introuvable"
        )
    return campagne


def _validate_statut(statut: Optional[str]) -> None:
    valeurs_valides = {"PREPARATION", "ACTIF", "CLOTURE"}
    if statut and statut not in valeurs_valides:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Statut invalide. Valeurs acceptées : {valeurs_valides}"
        )


def _sync_wilayas(db: Session, campagne_id: int, wilaya_ids: list[int]) -> None:
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


def get_all_campagnes(db: Session) -> list[Campagne]:
    return db.query(Campagne).order_by(Campagne.annee.desc()).all()


def get_campagne_by_id(db: Session, campagne_id: int) -> Campagne:
    return _get_or_404(db, campagne_id)


def create_campagne(db: Session, campagne_data: CampagneCreate) -> Campagne:
    existing = db.query(Campagne).filter(Campagne.annee == campagne_data.annee).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Une campagne pour l'année {campagne_data.annee} existe déjà"
        )
    _validate_statut(campagne_data.statut)
    campagne = Campagne(
        nom_fr=campagne_data.nom_fr,
        nom_ar=campagne_data.nom_ar,
        annee=campagne_data.annee,
        statut=campagne_data.statut or "PREPARATION",
        date_debut=campagne_data.date_debut,
        date_fin=campagne_data.date_fin,
        desc_fr=campagne_data.desc_fr,
        desc_ar=campagne_data.desc_ar,
    )
    db.add(campagne)
    db.flush()
    _sync_wilayas(db, campagne.id, campagne_data.wilayas or [])
    db.commit()
    db.refresh(campagne)
    return campagne


def update_campagne(db: Session, campagne_id: int, campagne_data: CampagneUpdate) -> Campagne:
    campagne = _get_or_404(db, campagne_id)
    update_fields = campagne_data.model_dump(exclude_unset=True, exclude={"wilayas"})
    if "statut" in update_fields:
        _validate_statut(update_fields["statut"])
    for key, value in update_fields.items():
        setattr(campagne, key, value)
    if campagne_data.wilayas is not None:
        _sync_wilayas(db, campagne.id, campagne_data.wilayas)
    db.commit()
    db.refresh(campagne)
    return campagne


def update_statut(db: Session, campagne_id: int, nouveau_statut: str) -> Campagne:
    _validate_statut(nouveau_statut)
    if nouveau_statut == "ACTIF":
        db.query(Campagne).filter(
            Campagne.id != campagne_id,
            Campagne.statut == "ACTIF"
        ).update({"statut": "PREPARATION"})
    campagne = _get_or_404(db, campagne_id)
    campagne.statut = nouveau_statut
    db.commit()
    db.refresh(campagne)
    return campagne


def delete_campagne(db: Session, campagne_id: int) -> None:
    campagne = _get_or_404(db, campagne_id)
    if db.query(Recensement).filter(Recensement.campagne_id == campagne_id).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Impossible de supprimer une campagne qui contient des recensements"
        )
    db.delete(campagne)
    db.commit()