from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import Optional

from app.config.database import get_db
from app.schemas.parcelle_schema import ParcelleCreate, ParcelleUpdate, ParcelleResponse
from app.services import parcelle_service as service

router = APIRouter(prefix="/parcelles", tags=["Parcelles"])


@router.get("/", response_model=list[ParcelleResponse])
def list_parcelles(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    exploitation_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    return service.list_parcelles(db, skip=skip, limit=limit, exploitation_id=exploitation_id)


@router.get("/{parcelle_id}", response_model=ParcelleResponse)
def get_parcelle(parcelle_id: int, db: Session = Depends(get_db)):
    return service.get_parcelle(db, parcelle_id)


@router.post("/", response_model=ParcelleResponse, status_code=status.HTTP_201_CREATED)
def create_parcelle(data: ParcelleCreate, db: Session = Depends(get_db)):
    return service.create_parcelle(db, data)


@router.patch("/{parcelle_id}", response_model=ParcelleResponse)
def update_parcelle(parcelle_id: int, data: ParcelleUpdate, db: Session = Depends(get_db)):
    return service.update_parcelle(db, parcelle_id, data)


@router.delete("/{parcelle_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_parcelle(parcelle_id: int, db: Session = Depends(get_db)):
    service.delete_parcelle(db, parcelle_id)
