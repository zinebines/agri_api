from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.config.database import get_db
from app.services import reference_service as service
from app.schemas.reference_schemas import ReferenceResponse, SexeResponse, WilayaResponse

router = APIRouter(prefix="/references", tags=["Reference Tables"])


@router.get("/wilayas", response_model=list[WilayaResponse])
def get_wilayas(db: Session = Depends(get_db)):
    return service.list_wilayas(db)


@router.get("/communes", response_model=list[ReferenceResponse])
def get_communes(
    wilaya_id: Optional[int] = Query(None, description="Filter by wilaya"),
    db: Session = Depends(get_db)
):
    return service.list_communes(db, wilaya_id=wilaya_id)


@router.get("/sexe", response_model=list[SexeResponse])
def get_sexe(db: Session = Depends(get_db)):
    return service.list_sexe(db)


@router.get("/niveau-instruction", response_model=list[ReferenceResponse])
def get_niveau_instruction(db: Session = Depends(get_db)):
    return service.list_niveau_instruction(db)


@router.get("/formation-agricole", response_model=list[ReferenceResponse])
def get_formation_agricole(db: Session = Depends(get_db)):
    return service.list_formation_agricole(db)


@router.get("/type-assurance", response_model=list[ReferenceResponse])
def get_type_assurance(db: Session = Depends(get_db)):
    return service.list_type_assurance(db)


@router.get("/nature-exploitant", response_model=list[ReferenceResponse])
def get_nature_exploitant(db: Session = Depends(get_db)):
    return service.list_nature_exploitant(db)


@router.get("/type-telephone", response_model=list[ReferenceResponse])
def get_type_telephone(db: Session = Depends(get_db)):
    return service.list_type_telephone(db)


@router.get("/statut-juridique", response_model=list[ReferenceResponse])
def get_statut_juridique(db: Session = Depends(get_db)):
    return service.list_statut_juridique(db)


@router.get("/type-activite", response_model=list[ReferenceResponse])
def get_type_activite(db: Session = Depends(get_db)):
    return service.list_type_activite(db)


@router.get("/type-accessibilite", response_model=list[ReferenceResponse])
def get_type_accessibilite(db: Session = Depends(get_db)):
    return service.list_type_accessibilite(db)


@router.get("/mode-exploitation", response_model=list[ReferenceResponse])
def get_mode_exploitation(db: Session = Depends(get_db)):
    return service.list_mode_exploitation(db)


@router.get("/statut-terre", response_model=list[ReferenceResponse])
def get_statut_terre(db: Session = Depends(get_db)):
    return service.list_statut_terre(db)


@router.get("/source-energie-type", response_model=list[ReferenceResponse])
def get_source_energie_type(db: Session = Depends(get_db)):
    return service.list_source_energie_type(db)
