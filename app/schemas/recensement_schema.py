from pydantic import BaseModel, model_validator
from typing import Optional, List
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
    statut: Optional[str] = "PREPARATION"          # PREPARATION | ACTIF | CLOTURE
    date_debut: Optional[date] = None
    date_fin: Optional[date] = None
    desc_fr: Optional[str] = None
    desc_ar: Optional[str] = None
    wilayas: Optional[List[int]] = []               # liste IDs wilayas (portée nationale si vide)

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
    statut: Optional[str] = None
    date_debut: Optional[date] = None
    date_fin: Optional[date] = None
    desc_fr: Optional[str] = None
    desc_ar: Optional[str] = None
    wilayas: Optional[List[int]] = None


class CampagneResponse(CampagneBase):
    id: int
    total_dossiers: int = 0
    valides: int = 0

    model_config = {"from_attributes": True}


# ── Exploitant (Champs 1–31) ──────────────────────────────────────────────────

class ExploitantBase(BaseModel):
    # Champ 1 - Date de passage
    date_passage: Optional[date] = None

    # Champs 2-3 - Recenseur
    recenseur_nom: Optional[str] = None
    recenseur_prenom: Optional[str] = None

    # Champ 4 - Date de contrôle
    date_controle: Optional[date] = None

    # Champs 5-6 - Contrôleur
    controleur_nom: Optional[str] = None
    controleur_prenom: Optional[str] = None

    # Champ 7 - Wilaya (ID 1-58)
    wilaya_id: Optional[int] = None

    # Champ 8 - Commune
    commune: Optional[str] = None

    # Champ 9 - Code commune/wilaya (4 segments)
    code_commune_1: Optional[str] = None
    code_commune_2: Optional[str] = None
    code_commune_3: Optional[str] = None
    code_commune_4: Optional[str] = None

    # Champ 10 - Lieu-dit / Zone
    lieu_dit: Optional[str] = None

    # Champ 11 - Numéro de district (2 segments)
    district_1: Optional[str] = None
    district_2: Optional[str] = None

    # Champ 12 - N° exploitation
    num_exploitation: Optional[str] = None

    # Champ 13-14 - Identité exploitant
    nom: Optional[str] = None
    prenom: Optional[str] = None

    # Champ 15 - Année de naissance
    annee_naissance: Optional[int] = None

    # Champ 16 - Sexe
    sexe: Optional[str] = None                     # "male" | "female"

    # Champ 17 - Niveau d'instruction
    niveau_instruction: Optional[str] = None        # لا شيء | ابتدائي | متوسط | ثانوي | جامعي

    # Champ 18 - Niveau formation agricole
    niveau_formation_agricole: Optional[str] = None # لا شيء | تأهيل | عون تقني | تقني | مهندس

    # Champ 19 - Adresse exploitant
    adresse: Optional[str] = None

    # Champ 20 - Téléphone (5 segments)
    telephone_1: Optional[str] = None
    telephone_2: Optional[str] = None
    telephone_3: Optional[str] = None
    telephone_4: Optional[str] = None
    telephone_5: Optional[str] = None

    # Champ 21 - Email
    email: Optional[str] = None

    # Champ 22 - NIN (6 segments)
    nin_1: Optional[str] = None
    nin_2: Optional[str] = None
    nin_3: Optional[str] = None
    nin_4: Optional[str] = None
    nin_5: Optional[str] = None
    nin_6: Optional[str] = None

    # Champ 23 - NIS (5 segments)
    nis_1: Optional[str] = None
    nis_2: Optional[str] = None
    nis_3: Optional[str] = None
    nis_4: Optional[str] = None
    nis_5: Optional[str] = None

    # Champ 24 - Carte agriculteur (4 segments)
    carte_1: Optional[str] = None
    carte_2: Optional[str] = None
    carte_3: Optional[str] = None
    carte_4: Optional[str] = None

    # Champ 25 - Inscription dans organisations
    inscrit_caw: Optional[bool] = False
    inscrit_capa: Optional[bool] = False
    inscrit_unpa: Optional[bool] = False
    inscrit_carm: Optional[bool] = False
    inscrit_ccw: Optional[bool] = False

    # Champ 26 - Type d'assurance
    assurance_type: Optional[str] = None            # "CASNOS" | "CNAS"

    # Champ 28 - Issu d'une famille agricole
    famille_agricole: Optional[str] = None          # "نعم" | "لا"

    # Champ 29 - Exploitant principal
    role: Optional[str] = None                      # "رئيسي" | "وحيد"

    # Champ 30 - Nombre de co-exploitants
    nb_co_exploitants: Optional[int] = 0

    # Champ 31 - Nature de l'exploitant
    nature: Optional[str] = None                    # "مالك" | "مسير"


class ExploitantCreate(ExploitantBase):
    pass


class ExploitantUpdate(BaseModel):
    date_passage: Optional[date] = None
    recenseur_nom: Optional[str] = None
    recenseur_prenom: Optional[str] = None
    date_controle: Optional[date] = None
    controleur_nom: Optional[str] = None
    controleur_prenom: Optional[str] = None
    wilaya_id: Optional[int] = None
    commune: Optional[str] = None
    nom: Optional[str] = None
    prenom: Optional[str] = None
    annee_naissance: Optional[int] = None
    sexe: Optional[str] = None
    adresse: Optional[str] = None
    email: Optional[str] = None
    nature: Optional[str] = None


class ExploitantResponse(ExploitantBase):
    id: int

    model_config = {"from_attributes": True}


# ── Exploitation (Champs 32–74) ───────────────────────────────────────────────

class ExploitationBase(BaseModel):
    # Lien vers l'exploitant propriétaire
    exploitant_id: int

    # Champ 32 - Nom de l'exploitation
    nom: Optional[str] = None

    # Champ 33 - Adresse
    adresse: Optional[str] = None

    # Champ 34 - Statut juridique
    statut_juridique: Optional[str] = None          # مؤسسة مدنية | مؤسسة عائلية | SARL | EURL | تعاونية | إيجار

    # Champ 35 - Coordonnées GPS
    longitude: Optional[float] = None
    latitude: Optional[float] = None

    # Champ 36 - Vocation
    vocation: Optional[str] = None                  # نباتي | حيواني | مختلط

    # Champ 37 - Si animal : a-t-il des terres ?
    terre_animal: Optional[str] = None              # مع أرض | بدون أرض

    # Champ 38 - Accessibilité
    accessibilite: Optional[str] = None             # طريق وطني | طريق ولائي | طريق بلدي | مسار ريفي

    # Champ 39 - Raccordée à l'électricité ?
    electricite: Optional[str] = None               # "نعم" | "لا"

    # Champ 40 - Raccordée au téléphone ?
    telephone: Optional[str] = None                 # "نعم" | "لا"

    # Champ 41 - Type de téléphone
    type_telephone: Optional[str] = None            # هاتف نقال | هاتف ثابت

    # Champ 42 - Connectée à Internet ?
    internet: Optional[str] = None                  # "نعم" | "لا"

    # Champ 43 - Internet utilisé pour l'agriculture ?
    internet_agricole: Optional[str] = None         # "نعم" | "لا"

    # Champs 47-51 - Superficies SAU (ha) : irriguée + sèche
    herbacee_irriguee: Optional[float] = None
    herbacee_sec: Optional[float] = None
    jacher_irriguee: Optional[float] = None
    jacher_sec: Optional[float] = None
    perenes_irriguee: Optional[float] = None
    perenes_sec: Optional[float] = None
    prairie_irriguee: Optional[float] = None
    prairie_sec: Optional[float] = None
    sau_irriguee: Optional[float] = None
    sau_sec: Optional[float] = None

    # Champs 52-56 - Autres superficies (ha)
    pacages: Optional[float] = None
    superficie_non_productive: Optional[float] = None
    superficie_sat: Optional[float] = None          # Champ 54 - SAT
    forets: Optional[float] = None
    superficie_totale: Optional[float] = None       # Champ 56 - ST

    # Champ 57 - En un seul bloc ?
    un_bloc: Optional[str] = None                   # "نعم" | "لا"

    # Champ 58 - Nombre de parcelles
    nombre_blocs: Optional[int] = None

    # Champ 59 - Occupants irréguliers ?
    occupants_irreguliers: Optional[str] = None     # "نعم" | "لا"

    # Champ 61 - Superficie bâtie (m²)
    surface_batie: Optional[float] = None

    # Champ 63 - Sources d'énergie
    energie_reseau: Optional[bool] = False
    energie_groupe: Optional[bool] = False
    energie_solaire: Optional[bool] = False
    energie_eolienne: Optional[bool] = False

    # Champs 65-74 - Arbres épars (nombre)
    arbres_oliviers: Optional[int] = 0
    arbres_figuiers: Optional[int] = 0
    arbres_noyaux: Optional[int] = 0
    arbres_vigne: Optional[int] = 0
    arbres_grenadiers: Optional[int] = 0
    arbres_amandiers: Optional[int] = 0
    arbres_cognassiers: Optional[int] = 0
    arbres_palmiers: Optional[int] = 0
    arbres_caroubier: Optional[int] = 0
    arbres_autres: Optional[int] = 0


class ExploitationCreate(ExploitationBase):
    pass


class ExploitationUpdate(BaseModel):
    nom: Optional[str] = None
    adresse: Optional[str] = None
    statut_juridique: Optional[str] = None
    longitude: Optional[float] = None
    latitude: Optional[float] = None
    vocation: Optional[str] = None
    accessibilite: Optional[str] = None
    superficie_totale: Optional[float] = None


class ExploitationResponse(ExploitationBase):
    id: int

    model_config = {"from_attributes": True}


# ── Recensement (ملف الإحصاء) ────────────────────────────────────────────────

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