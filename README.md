# Agri API — FastAPI + PostgreSQL

## Structure du projet

```
agri_api/
├── app/
│   ├── config/
│   │   ├── database.py      # Engine SQLAlchemy + get_db (Dependency)
│   │   └── settings.py      # Variables d'env via pydantic-settings
│   ├── models/
│   │   ├── __init__.py          # Importe tous les modèles
│   │   ├── reference_tables.py  # Toutes les tables de référence (sexe, wilayas…)
│   │   ├── commune.py
│   │   ├── exploitant.py        # Table principale exploitants
│   │   ├── exploitation.py
│   │   └── parcelle.py          # Parcelle + SourceEnergie
│   ├── schemas/
│   │   ├── reference_schemas.py
│   │   ├── exploitant_schema.py  # Base / Create / Update / Response
│   │   ├── exploitation_schema.py
│   │   └── parcelle_schema.py
│   ├── services/
│   │   ├── exploitant_service.py  # Business logic (CRUD + validation)
│   │   ├── exploitation_service.py
│   │   ├── parcelle_service.py
│   │   └── reference_service.py
│   ├── routers/
│   │   ├── exploitants.py    # Endpoints HTTP
│   │   ├── exploitations.py
│   │   ├── parcelles.py
│   │   └── references.py     # Toutes les listes de référence (read-only)
│   └── main.py               # App factory + include_router
├── .env.example
├── alembic.ini
├── requirements.txt
└── README.md
```

---

## Démarrage rapide (5 étapes)

### 1. Cloner / extraire le projet
```bash
cd agri_api
```

### 2. Environnement virtuel + dépendances
```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Configurer la base de données
```bash
cp .env.example .env
# Éditer .env et mettre vos identifiants PostgreSQL
```
```env
DATABASE_URL=postgresql://postgres:VOTRE_MOT_DE_PASSE@localhost:5432/agri_db
```

### 4. Créer la base et importer le schéma SQL
```bash
# Créer la base
psql -U postgres -c "CREATE DATABASE agri_db;"

# Importer le schéma + données de référence
psql -U postgres -d agri_db -f nex_data_base.txt
```

### 5. Lancer le serveur
```bash
uvicorn app.main:app --reload
```

API disponible sur : http://localhost:8000  
Documentation Swagger : http://localhost:8000/docs  
Documentation ReDoc : http://localhost:8000/redoc  

---

## Endpoints disponibles

### Exploitants — `/api/v1/exploitants`
| Méthode | URL | Description |
|---------|-----|-------------|
| GET | `/api/v1/exploitants/` | Liste avec pagination + recherche |
| GET | `/api/v1/exploitants/{id}` | Détail complet avec relations |
| POST | `/api/v1/exploitants/` | Créer un exploitant |
| PATCH | `/api/v1/exploitants/{id}` | Modifier (champs partiels) |
| DELETE | `/api/v1/exploitants/{id}` | Supprimer (cascade exploitations) |

### Exploitations — `/api/v1/exploitations`
| Méthode | URL | Description |
|---------|-----|-------------|
| GET | `/api/v1/exploitations/?exploitant_id=1` | Filtrer par exploitant |
| GET | `/api/v1/exploitations/?wilaya_id=3` | Filtrer par wilaya |
| POST | `/api/v1/exploitations/` | Créer |
| PATCH | `/api/v1/exploitations/{id}` | Modifier |
| DELETE | `/api/v1/exploitations/{id}` | Supprimer (cascade parcelles) |

### Parcelles — `/api/v1/parcelles`
| Méthode | URL | Description |
|---------|-----|-------------|
| GET | `/api/v1/parcelles/?exploitation_id=1` | Parcelles d'une exploitation |
| POST | `/api/v1/parcelles/` | Créer |
| PATCH | `/api/v1/parcelles/{id}` | Modifier |
| DELETE | `/api/v1/parcelles/{id}` | Supprimer |

### Tables de référence — `/api/v1/references` (read-only)
```
GET /api/v1/references/wilayas
GET /api/v1/references/communes?wilaya_id=3
GET /api/v1/references/sexe
GET /api/v1/references/niveau-instruction
GET /api/v1/references/formation-agricole
GET /api/v1/references/type-assurance
GET /api/v1/references/nature-exploitant
GET /api/v1/references/type-telephone
GET /api/v1/references/statut-juridique
GET /api/v1/references/type-activite
GET /api/v1/references/type-accessibilite
GET /api/v1/references/mode-exploitation
GET /api/v1/references/statut-terre
GET /api/v1/references/source-energie-type
```

---

## Exemple de requête — Créer un exploitant

```bash
curl -X POST http://localhost:8000/api/v1/exploitants/ \
  -H "Content-Type: application/json" \
  -d '{
    "nom_fr": "Benali",
    "prenom_fr": "Ahmed",
    "nin": "123456789",
    "telephone": "0555123456",
    "sexe_id": 1,
    "niveau_instruction_id": 3,
    "nature_exploitant_id": 1,
    "principal": true
  }'
```

---

## Ajouter l'authentification (plus tard)

Dans `app/config/` créer `security.py` avec JWT :
```python
from fastapi.security import OAuth2PasswordBearer
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
```
Puis ajouter `Depends(get_current_user)` dans les routes sensibles — l'architecture actuelle est prête pour ça sans modification.

---

## Architecture — Résumé

| Couche | Rôle |
|--------|------|
| `models/` | Définit les tables SQLAlchemy (ORM) |
| `schemas/` | Valide les entrées/sorties (Pydantic) |
| `services/` | Contient toute la logique métier |
| `routers/` | Expose les endpoints HTTP, délègue au service |
| `config/` | Connexion DB + variables d'environnement |
