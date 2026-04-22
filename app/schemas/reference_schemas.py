from pydantic import BaseModel
from typing import Optional


class ReferenceBase(BaseModel):
    nom_fr: Optional[str] = None
    nom_ar: Optional[str] = None


class ReferenceResponse(ReferenceBase):
    id: int

    model_config = {"from_attributes": True}


class SexeResponse(BaseModel):
    id: int
    libelle_fr: Optional[str] = None
    libelle_ar: Optional[str] = None

    model_config = {"from_attributes": True}


class WilayaBase(BaseModel):
    code: Optional[str] = None
    nom_fr: Optional[str] = None
    nom_ar: Optional[str] = None


class WilayaCreate(WilayaBase):
    pass


class WilayaResponse(WilayaBase):
    id: int

    model_config = {"from_attributes": True}
