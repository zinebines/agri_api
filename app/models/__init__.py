from app.models.reference_tables import (
    Sexe, NiveauInstruction, FormationAgricole, TypeAssurance,
    NatureExploitant, TypeTelephone, StatutJuridique, TypeActivite,
    TypeAccessibilite, ModeExploitation, StatutTerre, SourceEnergieType, Wilaya
)
from app.models.commune import Commune
from app.models.exploitant import Exploitant
from app.models.exploitation import Exploitation
from app.models.parcelle import Parcelle, SourceEnergie
from app.models.user import User
from app.models.recensement import RecensementStatus, RecensementCampagne, Recensement