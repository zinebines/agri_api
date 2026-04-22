from sqlalchemy.orm import Session
from app.models.reference_tables import (
    Sexe, NiveauInstruction, FormationAgricole, TypeAssurance,
    NatureExploitant, TypeTelephone, StatutJuridique, TypeActivite,
    TypeAccessibilite, ModeExploitation, StatutTerre, SourceEnergieType, Wilaya
)
from app.models.commune import Commune
from fastapi import HTTPException, status


def get_all(db: Session, model):
    return db.query(model).all()


def get_by_id_or_404(db: Session, model, item_id: int):
    obj = db.get(model, item_id)
    if not obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{model.__tablename__} with id={item_id} not found"
        )
    return obj


# Typed helpers used in routers
def list_wilayas(db: Session):          return get_all(db, Wilaya)
def list_communes(db: Session, wilaya_id: int = None):
    q = db.query(Commune)
    if wilaya_id:
        q = q.filter(Commune.wilaya_id == wilaya_id)
    return q.all()

def list_sexe(db: Session):             return get_all(db, Sexe)
def list_niveau_instruction(db: Session): return get_all(db, NiveauInstruction)
def list_formation_agricole(db: Session): return get_all(db, FormationAgricole)
def list_type_assurance(db: Session):   return get_all(db, TypeAssurance)
def list_nature_exploitant(db: Session): return get_all(db, NatureExploitant)
def list_type_telephone(db: Session):   return get_all(db, TypeTelephone)
def list_statut_juridique(db: Session): return get_all(db, StatutJuridique)
def list_type_activite(db: Session):    return get_all(db, TypeActivite)
def list_type_accessibilite(db: Session): return get_all(db, TypeAccessibilite)
def list_mode_exploitation(db: Session): return get_all(db, ModeExploitation)
def list_statut_terre(db: Session):     return get_all(db, StatutTerre)
def list_source_energie_type(db: Session): return get_all(db, SourceEnergieType)
