CREATE TABLE `utilisateurs` (
  `id_utilisateur` integer PRIMARY KEY AUTO_INCREMENT,
  `prenom` varchar(255),
  `nom` varchar(255),
  `email` varchar(255) UNIQUE,
  `mot_de_passe` varchar(255),
  `role` varchar(255),
  `telephone` varchar(255),
  `date_creation` timestamp
);

CREATE TABLE `etudiants` (
  `id_etudiant` integer PRIMARY KEY AUTO_INCREMENT,
  `utilisateur_id` integer UNIQUE NOT NULL,
  `numero_etudiant` varchar(255) UNIQUE,
  `promotion` varchar(255),
  `niveau` integer,
  `groupe` varchar(255),
  `date_naissance` date,
  `adresse` text,
  `contact_urgence` varchar(255)
);

CREATE TABLE `enseignants` (
  `id_enseignant` integer PRIMARY KEY AUTO_INCREMENT,
  `utilisateur_id` integer UNIQUE NOT NULL,
  `specialisation` varchar(255),
  `date_embauche` date
);

CREATE TABLE `administrateurs` (
  `id_admin` integer PRIMARY KEY AUTO_INCREMENT,
  `utilisateur_id` integer UNIQUE NOT NULL
);

CREATE TABLE `cours` (
  `id_cours` integer PRIMARY KEY AUTO_INCREMENT,
  `titre` varchar(255),
  `code` varchar(255),
  `description` text,
  `credits` integer,
  `semestre` integer,
  `niveau` integer,
  `capacite_max` integer,
  `enseignant_id` integer NOT NULL
);

CREATE TABLE `inscriptions` (
  `id_inscription` integer PRIMARY KEY AUTO_INCREMENT,
  `etudiant_id` integer NOT NULL,
  `cours_id` integer NOT NULL,
  `date_inscription` date,
  `statut` varchar(255)
);

CREATE TABLE `notes` (
  `id_note` integer PRIMARY KEY AUTO_INCREMENT,
  `etudiant_id` integer NOT NULL,
  `cours_id` integer NOT NULL,
  `type_evaluation` varchar(255),
  `note` float,
  `coefficient` integer,
  `date_creation` timestamp,
  `validee` boolean
);

CREATE TABLE `seances` (
  `id_seance` integer PRIMARY KEY AUTO_INCREMENT,
  `cours_id` integer NOT NULL,
  `date_seance` date,
  `heure_debut` time,
  `heure_fin` time,
  `salle` varchar(255),
  `type_seance` varchar(255)
);

CREATE TABLE `absences` (
  `id_absence` integer PRIMARY KEY AUTO_INCREMENT,
  `etudiant_id` integer NOT NULL,
  `seance_id` integer NOT NULL,
  `statut` varchar(255),
  `justifiee` boolean,
  `commentaire` text
);

CREATE TABLE `notifications` (
  `id_notification` integer PRIMARY KEY AUTO_INCREMENT,
  `utilisateur_id` integer NOT NULL,
  `titre` varchar(255),
  `message` text,
  `est_lue` boolean,
  `date_creation` timestamp
);

CREATE TABLE `messages` (
  `id_message` integer PRIMARY KEY AUTO_INCREMENT,
  `expediteur_id` integer NOT NULL,
  `destinataire_id` integer NOT NULL,
  `sujet` varchar(255),
  `contenu` text,
  `lu` boolean,
  `date_envoi` timestamp
);

CREATE TABLE `news` (
  `id_news` integer PRIMARY KEY AUTO_INCREMENT,
  `auteur_id` integer NOT NULL,
  `titre` varchar(255),
  `contenu` text,
  `categorie` varchar(255),
  `date_publication` timestamp
);

CREATE UNIQUE INDEX `inscriptions_index_0` ON `inscriptions` (`etudiant_id`, `cours_id`);

ALTER TABLE `etudiants` ADD FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id_utilisateur`);

ALTER TABLE `enseignants` ADD FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id_utilisateur`);

ALTER TABLE `administrateurs` ADD FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id_utilisateur`);

ALTER TABLE `cours` ADD FOREIGN KEY (`enseignant_id`) REFERENCES `enseignants` (`id_enseignant`);

ALTER TABLE `inscriptions` ADD FOREIGN KEY (`etudiant_id`) REFERENCES `etudiants` (`id_etudiant`);

ALTER TABLE `inscriptions` ADD FOREIGN KEY (`cours_id`) REFERENCES `cours` (`id_cours`);

ALTER TABLE `notes` ADD FOREIGN KEY (`etudiant_id`) REFERENCES `etudiants` (`id_etudiant`);

ALTER TABLE `notes` ADD FOREIGN KEY (`cours_id`) REFERENCES `cours` (`id_cours`);

ALTER TABLE `seances` ADD FOREIGN KEY (`cours_id`) REFERENCES `cours` (`id_cours`);

ALTER TABLE `absences` ADD FOREIGN KEY (`etudiant_id`) REFERENCES `etudiants` (`id_etudiant`);

ALTER TABLE `absences` ADD FOREIGN KEY (`seance_id`) REFERENCES `seances` (`id_seance`);

ALTER TABLE `notifications` ADD FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id_utilisateur`);

ALTER TABLE `messages` ADD FOREIGN KEY (`expediteur_id`) REFERENCES `utilisateurs` (`id_utilisateur`);

ALTER TABLE `messages` ADD FOREIGN KEY (`destinataire_id`) REFERENCES `utilisateurs` (`id_utilisateur`);

ALTER TABLE `news` ADD FOREIGN KEY (`auteur_id`) REFERENCES `utilisateurs` (`id_utilisateur`);
