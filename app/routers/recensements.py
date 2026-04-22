from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import Optional

from app.config.database import get_db
from app.schemas.recensement_schema import (
    CampagneCreate, CampagneUpdate, CampagneResponse,
    RecensementCreate, RecensementUpdate, RecensementResponse,
    RecensementStatusResponse, RecensementChangeStatus,
)
from app.services import recensement_service as service

router = APIRouter(prefix="/recensements", tags=["Recensements"])


# ── Status (read-only) ────────────────────────────────────────────────────────

@router.get("/status", response_model=list[RecensementStatusResponse])
def get_status(db: Session = Depends(get_db)):
    """Liste des statuts possibles (En cours, Recensé, Contrôlé…)."""
    return service.list_status(db)


# ── Campagnes ─────────────────────────────────────────────────────────────────

@router.get("/campagnes", response_model=list[CampagneResponse])
def list_campagnes(db: Session = Depends(get_db)):
    """Liste toutes les campagnes, triées par année décroissante."""
    return service.list_campagnes(db)


@router.get("/campagnes/{campagne_id}", response_model=CampagneResponse)
def get_campagne(campagne_id: int, db: Session = Depends(get_db)):
    return service.get_campagne(db, campagne_id)


@router.post("/campagnes", response_model=CampagneResponse, status_code=status.HTTP_201_CREATED)
def create_campagne(data: CampagneCreate, db: Session = Depends(get_db)):
    """Créer une nouvelle campagne (année doit être unique)."""
    return service.create_campagne(db, data)


@router.patch("/campagnes/{campagne_id}", response_model=CampagneResponse)
def update_campagne(campagne_id: int, data: CampagneUpdate, db: Session = Depends(get_db)):
    return service.update_campagne(db, campagne_id, data)


@router.delete("/campagnes/{campagne_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_campagne(campagne_id: int, db: Session = Depends(get_db)):
    """Supprime uniquement si la campagne n'a aucun recensement lié."""
    service.delete_campagne(db, campagne_id)


# ── Recensements ──────────────────────────────────────────────────────────────

@router.get("/", response_model=list[RecensementResponse])
def list_recensements(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    campagne_id: Optional[int] = Query(None, description="Filtrer par campagne"),
    status_id: Optional[int] = Query(None, description="Filtrer par statut"),
    recenseur_id: Optional[int] = Query(None, description="Filtrer par recenseur"),
    db: Session = Depends(get_db),
):
    return service.list_recensements(
        db, skip=skip, limit=limit,
        campagne_id=campagne_id,
        status_id=status_id,
        recenseur_id=recenseur_id,
    )


@router.get("/{recensement_id}", response_model=RecensementResponse)
def get_recensement(recensement_id: int, db: Session = Depends(get_db)):
    return service.get_recensement(db, recensement_id)


@router.post("/", response_model=RecensementResponse, status_code=status.HTTP_201_CREATED)
def create_recensement(data: RecensementCreate, db: Session = Depends(get_db)):
    """
    Crée un recensement. Statut par défaut = 1 (En cours).
    Une exploitation ne peut être recensée qu'une seule fois par campagne.
    """
    return service.create_recensement(db, data)


@router.patch("/{recensement_id}", response_model=RecensementResponse)
def update_recensement(
    recensement_id: int,
    data: RecensementUpdate,
    db: Session = Depends(get_db),
):
    """Modifier les infos d'un recensement (recenseur, dates…)."""
    return service.update_recensement(db, recensement_id, data)


@router.patch("/{recensement_id}/status", response_model=RecensementResponse)
def change_status(
    recensement_id: int,
    data: RecensementChangeStatus,
    db: Session = Depends(get_db),
):
    """
    Endpoint dédié au changement de statut :
    1=En cours | 2=Recensé | 3=Contrôlé | 4=Validé | 5=Rejeté
    """
    return service.change_status(db, recensement_id, data)


@router.delete("/{recensement_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_recensement(recensement_id: int, db: Session = Depends(get_db)):
    service.delete_recensement(db, recensement_id)
