from sqlalchemy import Column, Integer, String
from app.config.database import Base


class Sexe(Base):
    __tablename__ = "sexe"
    id = Column(Integer, primary_key=True)
    libelle_fr = Column(String(50))
    libelle_ar = Column(String(50))


class NiveauInstruction(Base):
    __tablename__ = "niveau_instruction"
    id = Column(Integer, primary_key=True)
    nom_fr = Column(String(150))
    nom_ar = Column(String(150))


class FormationAgricole(Base):
    __tablename__ = "formation_agricole"
    id = Column(Integer, primary_key=True)
    nom_fr = Column(String(150))
    nom_ar = Column(String(150))


class TypeAssurance(Base):
    __tablename__ = "type_assurance"
    id = Column(Integer, primary_key=True)
    nom_fr = Column(String(100))
    nom_ar = Column(String(100))


class NatureExploitant(Base):
    __tablename__ = "nature_exploitant"
    id = Column(Integer, primary_key=True)
    nom_fr = Column(String(100))
    nom_ar = Column(String(100))


class TypeTelephone(Base):
    __tablename__ = "type_telephone"
    id = Column(Integer, primary_key=True)
    nom_fr = Column(String(50))
    nom_ar = Column(String(50))


class StatutJuridique(Base):
    __tablename__ = "statut_juridique"
    id = Column(Integer, primary_key=True)
    nom_fr = Column(String(150))
    nom_ar = Column(String(150))


class TypeActivite(Base):
    __tablename__ = "type_activite"
    id = Column(Integer, primary_key=True)
    nom_fr = Column(String(100))
    nom_ar = Column(String(100))


class TypeAccessibilite(Base):
    __tablename__ = "type_accessibilite"
    id = Column(Integer, primary_key=True)
    nom_fr = Column(String(100))
    nom_ar = Column(String(100))


class ModeExploitation(Base):
    __tablename__ = "mode_exploitation"
    id = Column(Integer, primary_key=True)
    nom_fr = Column(String(200))
    nom_ar = Column(String(200))


class StatutTerre(Base):
    __tablename__ = "statut_terre"
    id = Column(Integer, primary_key=True)
    nom_fr = Column(String(150))
    nom_ar = Column(String(150))


class SourceEnergieType(Base):
    __tablename__ = "source_energie_type"
    id = Column(Integer, primary_key=True)
    nom_fr = Column(String(100))
    nom_ar = Column(String(100))


class Wilaya(Base):
    __tablename__ = "wilayas"
    id = Column(Integer, primary_key=True)
    code = Column(String(10), unique=True)
    nom_fr = Column(String(150))
    nom_ar = Column(String(150))
