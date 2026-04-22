from pydantic import BaseModel, model_validator
from typing import Optional
from datetime import date


# ── Reference ────────────────────────────────────────────────────────────────

class RecensementStatusResponse(BaseModel):
    id: int
    nom_fr: Optional[str] = None
    nom_ar: Optional[str] = None

    model_config = {"from_attributes": True}


# ── Campagne ──────────────────────────────────────────────────────────────────

class CampagneBase(BaseModel):
    nom_fr: str
    nom_ar: Optional[str] = None
    annee: int
    date_debut: Optional[date] = None
    date_fin: Optional[date] = None

    @model_validator(mode="after")
    def check_dates(self):
        if self.date_debut and self.date_fin:
            if self.date_fin < self.date_debut:
                raise ValueError("date_fin doit être après date_debut")
        return self


class CampagneCreate(CampagneBase):
    pass


class CampagneUpdate(BaseModel):
    nom_fr: Optional[str] = None
    nom_ar: Optional[str] = None
    date_debut: Optional[date] = None
    date_fin: Optional[date] = None


class CampagneResponse(CampagneBase):
    id: int

    model_config = {"from_attributes": True}


# ── Recensement ───────────────────────────────────────────────────────────────

class RecensementBase(BaseModel):
    campagne_id: int
    exploitation_id: int
    recenseur_id: Optional[int] = None
    controleur_id: Optional[int] = None
    date_recensement: Optional[date] = None
    date_controle: Optional[date] = None
    status_id: Optional[int] = None


class RecensementCreate(RecensementBase):
    pass


class RecensementUpdate(BaseModel):
    recenseur_id: Optional[int] = None
    controleur_id: Optional[int] = None
    date_recensement: Optional[date] = None
    date_controle: Optional[date] = None
    status_id: Optional[int] = None


class RecensementResponse(RecensementBase):
    id: int
    status: Optional[RecensementStatusResponse] = None

    model_config = {"from_attributes": True}


# ── Action spéciale : changer le statut ──────────────────────────────────────

class RecensementChangeStatus(BaseModel):
    status_id: int
