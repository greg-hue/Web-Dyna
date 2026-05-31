# SmartCampus - Plateforme de Gestion Scolaire (IFSI)

SmartCampus est une application web dédiée à la gestion de la vie scolaire, conçue spécifiquement pour répondre aux besoins d'un institut. Ici, nous avons decidé de créer une plateforme dédiée a une ecole d'infirmier.
l'IFSI ( Institut de Formation en Soins Infirmier ) Florence Nightingale ( une infirmiere britanique, pionniaire des soins infirmiers modernes et de l'utilisation des statistiques).

La plateforme permet de connecter ses étudiants, ses professeurs et ses administrateur au sein d'une plateforme centralisée.

# Fonctionnalités Principales

L'utilisateur se connnecte grace :
à son **Identifiant** ( adresse mail de l'ecole, avecx prenom.nom@ifsi.fr )
à son **Mot_de_Passe** ( ici "admin123" pour les administrateurs et "password123" pour les etudiants et enseignants)
et à son **profil** ( étudiant / enseignant / administreur ) en cochant la case appropriée.

L'application est divisée en trois espaces distincts selon le rôle de l'utilisateur :

# Espace Étudiant

**Tableau de bord** : Vue d'ensemble de la semaine (cours, dernières notes, absences, notifications).
**Emploi du temps** : Consultation des cours semaine par semaine.
**Présences** : Signalement de présence via la saisie d'un code ou le scan d'un QR Code.
**Notes & Absences** : Suivi des résultats scolaires et de l'assiduité.
**Messagerie** : Communication interne avec les professeurs et l'administration.

# Espace Professeur
**Gestion des présences** : Génération de QR Codes dynamiques pour l'appel en classe et ajustement manuel.
**Notes et Évaluations** : Saisie et modification des notes des étudiants.
**Mes Cours** : Consultation des modules et séances assignés.
**Messagerie** : Échanges avec les étudiants et la direction.

# Espace Administrateur
**Gestion des utilisateurs** : Ajout, modification et suppression des profils (étudiants, profs, admins).
**Gestion des cours et classes** : Planification et attribution des séances.
**Statistiques & Alertes** : Suivi global de l'établissement (absentéisme, indicateurs de performance).
**Actualités (News)** : Publication d'annonces diffusées sur les tableaux de bord.

# Technologies Utilisées

**Frontend** : HTML5, CSS3, JavaScript (Vanilla)
**Backend** : PHP 
**Base de données** : MySQL (fichiers SQL et modèles conceptuels fournis)
**Outils tiers** : Librairie QRCode.js / Html5QrcodeScanner (pour l'appel)

## Structure du Projet

Le dépôt est organisé de la manière suivante :

/backend/ : Contient l'ensemble des scripts PHP de l'API (authentification, requêtes BDD), classés par acteur.
/database/ : Contient les scripts de création de la base de données (`.sql`) et les schémas relationnels.
/docs/ : Regroupe la documentation du projet (wireframes, storyboards, schémas de BDD).
/frontend/ : Contient l'interface utilisateur (HTML/CSS/JS), organisée par espaces de connexion.

# Installation et Déploiement

Pour faire tourner le projet en local sur votre machine :

1. Clonez ce dépôt : [github)(https://github.com/greg-hue/Web-Dyna.git)
2. copiez le dossier du projet et placez le répertoire dans votre serveur mamps ("htdocs").
3. Ouvrez votre gestionnaire de base de données (phpMyAdmin) :
   - Créez une base de données nommée <smartcampus>.
   - Importez le fichier principal `/database/schema_bdd.sql` pour créer les tables
   - insérer les données dans l'ordre suivant : etudiant, prof, admin, cours, séances, inscriptions, notes, absences, messages, news, notifications, 
5. Lancez le serveur mamp surtout "MySQL Serveur"
6. Lancez l'application en accédant à : <http://localhost/Web-Dyna/frontend/authentification.html> ( Web-Dyna etant notre nom de dossier ) 

# Auteurs

Ce projet a été crée par 

Grégoire Nogier
Théophile Carayon
Eloi Gaillard

pour l'institut fictif Florence Nightingale dans le cadre du projet de web-dynamique au second semestre de deuxième année à l'ECE Paris
