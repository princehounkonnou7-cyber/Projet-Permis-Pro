-- 1. Table des Auto-Écoles (Tenants)
CREATE TABLE IF NOT EXISTS auto_ecoles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    telephone TEXT,
    adresse TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table des Profils Utilisateurs (Admins, Profs, Étudiants)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    auto_ecole_id UUID REFERENCES auto_ecoles(id) ON DELETE CASCADE,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'prof', 'etudiant')),
    type_formation TEXT CHECK (type_formation IN ('en_ligne', 'presentiel')),
    telephone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Table des Cours et Supports Pédagogiques
CREATE TABLE IF NOT EXISTS cours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auto_ecole_id UUID REFERENCES auto_ecoles(id) ON DELETE CASCADE,
    titre TEXT NOT NULL,
    description TEXT,
    categorie TEXT DEFAULT 'Code de la route',
    contenu_url TEXT,
    visibilite TEXT DEFAULT 'tous' CHECK (visibilite IN ('tous', 'en_ligne', 'presentiel')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Table des Plannings et Emplois du Temps
CREATE TABLE IF NOT EXISTS planning (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auto_ecole_id UUID REFERENCES auto_ecoles(id) ON DELETE CASCADE,
    titre TEXT NOT NULL,
    description TEXT,
    date_debut TIMESTAMP WITH TIME ZONE NOT NULL,
    date_fin TIMESTAMP WITH TIME ZONE NOT NULL,
    type_cours TEXT NOT NULL CHECK (type_cours IN ('ligne', 'presentiel', 'examen')),
    lieu_ou_lien TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Table de Suivi des Finances et Paiements
CREATE TABLE IF NOT EXISTS paiements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auto_ecole_id UUID REFERENCES auto_ecoles(id) ON DELETE CASCADE,
    etudiant_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    montant_total DECIMAL(10,2) NOT NULL,
    montant_paye DECIMAL(10,2) DEFAULT 0.00,
    statut TEXT DEFAULT 'en_attente' CHECK (statut IN ('paye', 'partiel', 'en_attente')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

