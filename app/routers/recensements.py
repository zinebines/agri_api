from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import Optional

from app.config.database import get_db
from app.schemas.recensement_schema import (
    RecensementCreate,
    RecensementUpdate,
    RecensementResponse,
    RecensementStatusResponse,
    RecensementChangeStatus,
)
from app.services import recensement_service as service

router = APIRouter(prefix="/recensements", tags=["Recensements"])


# ── Statuts (lecture seule) ───────────────────────────────────────────────────

@router.get("/statuts", response_model=list[RecensementStatusResponse])
def list_statuts(db: Session = Depends(get_db)):
    """
    Liste des statuts possibles :
    PREPARATION | ACTIF | CLOTURE | VALIDE | REJETE
    Inclut id, code, nom_fr, nom_ar.
    """
    return service.list_status(db)


# ── Recensements ──────────────────────────────────────────────────────────────

@router.get("/", response_model=list[RecensementResponse])
def list_recensements(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    campagne_id: Optional[int] = Query(None, description="Filtrer par campagne"),
    status_id: Optional[int] = Query(None, description="Filtrer par statut"),
    recenseur_id: Optional[int] = Query(None, description="Filtrer par recenseur"),
    controleur_id: Optional[int] = Query(None, description="Filtrer par contrôleur"),
    exploitation_id: Optional[int] = Query(None, description="Filtrer par exploitation"),
    db: Session = Depends(get_db),
):
    """
    Liste paginée des recensements avec filtres optionnels.
    Utilisé par le frontend pour afficher les dossiers d'une campagne.
    """
    return service.list_recensements(
        db,
        skip=skip,
        limit=limit,
        campagne_id=campagne_id,
        status_id=status_id,
        recenseur_id=recenseur_id,
        controleur_id=controleur_id,
        exploitation_id=exploitation_id,
    )


@router.get("/{recensement_id}", response_model=RecensementResponse)
def get_recensement(recensement_id: int, db: Session = Depends(get_db)):
    """Retourne le détail d'un recensement par ID."""
    return service.get_recensement(db, recensement_id)


@router.post("/", response_model=RecensementResponse, status_code=status.HTTP_201_CREATED)
def create_recensement(data: RecensementCreate, db: Session = Depends(get_db)):
    """
    Crée un recensement pour une exploitation dans une campagne.
    - Statut initial : PREPARATION (id=1).
    - Contrainte unique : une exploitation ne peut être recensée
      qu'une seule fois par campagne.
    - La campagne doit être ACTIF pour accepter de nouveaux recensements.
    """
    return service.create_recensement(db, data)


@router.patch("/{recensement_id}", response_model=RecensementResponse)
def update_recensement(
    recensement_id: int,
    data: RecensementUpdate,
    db: Session = Depends(get_db),
):
    """
    Modifier les informations d'un recensement :
    recenseur, contrôleur, dates de passage et de contrôle.
    """
    return service.update_recensement(db, recensement_id, data)


@router.patch("/{recensement_id}/statut", response_model=RecensementResponse)
def change_statut(
    recensement_id: int,
    data: RecensementChangeStatus,
    db: Session = Depends(get_db),
):
    """
    Endpoint dédié au changement de statut d'un recensement.
    Transitions autorisées :
      PREPARATION → ACTIF → VALIDE | REJETE
    Le contrôleur peut rejeter ou valider, le recenseur passe en ACTIF.
    """
    return service.change_status(db, recensement_id, data)


@router.delete("/{recensement_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_recensement(recensement_id: int, db: Session = Depends(get_db)):
    """
    Supprime un recensement.
    Refusé si le statut est VALIDE (dossier clôturé).
    """
    service.delete_recensement(db, recensement_id)