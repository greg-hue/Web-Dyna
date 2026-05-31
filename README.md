# SmartCampus - Plateforme de Gestion Scolaire (IFSI)

SmartCampus c'est une appli web complète pour gérer la vie scolaire, faite exprès pour un institut. On a choisi de faire ça pour une école d'infirmiers : l'IFSI Florence Nightingale (en hommage à l'infirmière britannique pionnière des soins modernes et des stats). 

Le site centralise tout le système pour les étudiants, les profs et les admins. Elle automatise la gestion des présences, le suivi des notes, l'organisation des cours et la communication interne.


# Connexion et Sécurité

Le système d'authentification gere la sécurité et redirige chaque utilisateur sur son espace selon son rôle.

Pour se connecter il faut :
- L'identifiant (mail de l'école : `prenom.nom@ifsi.fr`).
- Le mot de passe (`admin123` pour les admins, `password123` pour les étudiants et profs).
- Choisir son profil (étudiant / enseignant / administrateur) en cochant la case.

Le script `auth.js` bloque l'accès aux pages si la session n'est pas valide. Une fois connecté, les infos sont stockées dans le `localStorage` de la session. Chaque page JS fait une verif du rôle au chargement (`DOMContentLoaded`). Si le rôle ne correspond pas ou si le stockage est vide, retour direct à la page `authentification.html`.

# Espace Étudiant

L'interface de l'étudiant lui permet de suivre sa scolarité au jour le jour et de valider sa présence en cours.

**Tableau de bord** : recup globale des données de la semaine. Il affiche la moyenne calculée dynamiquement, le nombre total d'absences, le nombre de contrôles prévus et la dernière notification reçue en bas de l'écran.

**Emploi du temps** : voir les cours semaine par semaine avec une séparation automatique jour par jour pour plus de lisibilité. Le tableau affiche la date, l'horaire, le type de cours (CM/TD/TP), le titre du module et la salle.

**Présences** : validation de la présence en temps réel. L'étudiant peut taper le code de secours ou utiliser le bouton scanner pour ouvrir la caméra (`Html5QrcodeScanner`) et lire le QR Code du prof. Le script envoie les données à `validerPresenceQR.php` pour maj le statut en BDD.

**Notes & Absences** : recup des 3 dernières notes avec les coefficients pour le calcul de la moyenne et historique complet des absences ou retards.

**Messagerie** : liste des messages reçus et formulaire pour envoyer un message ou répondre directement à un prof.


# Espace Professeur

Cet espace permet au prof de gérer ses cours, de faire l'appel et de noter les étudiants.

**Gestion des présences** : le prof sélectionne son cours dans une liste déroulante et le tableau affiche les étudiants associés. Il peut lancer l'appel en cliquant sur "Lancer l'appel QR". Le script `genererQRSeance.php` crée un token unique dans la table `seances` avec une date d'expiration. Un système de `setInterval` rafraîchit le tableau du prof toutes les 3 secondes : dès qu'un étudiant valide son code, sa ligne passe en "Présent" en direct sans recharger la page. Le prof peut aussi faire un ajustement manuel (présent, retard, absent, justifié).

**Notes et Évaluations** : saisie des notes par matière avec gestion des coefficients et type d'évaluation (partiel, CC). Le prof peut ajouter et maj les notes d'une classe.

**Mes Cours** : recup de la liste des cours assignés au prof avec le niveau, le semestre et la salle de cours.

**Messagerie** : boîte de réception des messages des étudiants et de l'administration avec système de réponse rapide.


# Espace Administrateur

C'est le panneau de contrôle global pour gérer la structure de l'école et recup les statistiques.

**Gestion des utilisateurs** : CRUD complet pour ajouter, maj et supprimer des profils dans la table utilisateurs (sécurisation des rôles et des accès).

**Gestion des cours et classes** : planification des séances, création des matières, affectation des salles et attribution des cours aux profs.

**Statistiques & Alertes** : suivi général de l'établissement avec recup du taux d'absentéisme global et alertes automatiques si un étudiant dépasse un quota d'absences non justifiées.

**Actualités (News)** : outil de publication pour poster des annonces importantes. Le texte est stocké en BDD et s'affiche automatiquement sur le dashboard des étudiants et des profs.

# Technologies utilisées

L'architecture est basée sur le modèle client-serveur avec des requêtes asynchrones pour éviter les rechargements de page.

Frontend : HTML pour la structure, CSS pour le design global (layouts, tableaux, responsive) et JavaScript avec `fetch` pour communiquer avec l'API PHP.

Backend : scripts PHP qui reçoivent les requêtes, font les verif de sécurité, traitent les données et retournent du JSON.

BDD : MySQL avec gestion des clés étrangères pour lier les étudiants aux inscriptions, les séances aux absences, etc.


# Structure du projet

Le projet est découpé proprement pour séparer le code qui tourne sur le serveur du code affiché à l'utilisateur :

`/backend/` : l'ensemble des scripts PHP.

Le dossier contient les fichiers de base (`authentification.php`, `connexionBDD.php`)
et trois sous-dossiers (Admin, `Etudiant`, `Prof`) qui contiennent les fichiers spécifiques à chaque rôle pour sécuriser l'API.

`/database/` : contient le fichier `schema_bdd.sql` complet pour monter la structure, ainsi que les fichiers de données séparés par table pour les tests.

`/docs/` : centralise les wireframes de l'interface, les storyboards et les schémas SVG de la BDD pour l'explication technique du modèle.

`/frontend/` : contient l'interface graphique. La racine contient l'authentification, et le dossier `espaces` est divisé par rôle, avec les fichiers HTML et JS correspondants pour chaque fonctionnalité.


# Installation et lancement

Pour configurer et lancer le projet en local sur votre machine :

1. Cloner le projet depuis le dépôt officiel : [GitHub](https://github.com/greg-hue/Web-Dyna.git)
2. Mettre l'intégralité du dossier `Web-Dyna` dans le répertoire `htdocs` de votre serveur MAMP.
3. Configurer la base de données sur phpMyAdmin :
   - Créer une nouvelle BDD et la nommer exactement `ifsi_smartcampus`.
   - Aller dans l'onglet Importer et charger le fichier principal `/database/schema_bdd.sql` pour générer la structure des tables.
   - Importer ensuite les données de test dans cet ordre précis pour respecter les contraintes de clés étrangères : etudiant, prof, admin, cours, seances, inscriptions, notes, absences, messages, news, notifications.
4. Lancer l'application MAMP et faire la verif que les voyants Apache et MySQL Server sont bien actifs et au vert.
5. Ouvrir votre navigateur web et accéder à l'adresse de départ : `http://localhost/Web-Dyna/frontend/authentification.html`.

# Auteurs

Projet développé et réalisé par :
- Grégoire Nogier
- Théophile Carayon
- Eloi Gaillard

Développé pour l'institut fictif Florence Nightingale dans le cadre du module de Web Dynamique (ECE Paris, Année 2 - Semestre 2 / S4).
