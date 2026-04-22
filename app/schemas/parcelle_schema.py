from pydantic import BaseModel
from typing import Optional
from decimal import Decimal


class ParcelleBase(BaseModel):
    exploitation_id: Optional[int] = None
    mode_exploitation_id: Optional[int] = None
    statut_terre_id: Optional[int] = None
    superficie: Optional[Decimal] = None
    acte_concession: bool = False
    nb_eac_exploitants: int = 0
    nb_blocs: int = 1
    bloc_unique: bool = True


class ParcelleCreate(ParcelleBase):
    exploitation_id: int  # Required


class ParcelleUpdate(ParcelleBase):
    pass


class ParcelleResponse(ParcelleBase):
    id: int

    model_config = {"from_attributes": True}
