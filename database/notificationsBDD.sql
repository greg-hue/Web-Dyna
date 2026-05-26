INSERT INTO notifications
(utilisateur_id, titre, message, est_lue, date_creation)
VALUES

-- Notifications générales étudiants
(1,'Bienvenue sur SmartCampus','Votre compte étudiant a bien été activé.',FALSE,NOW()),
(2,'Bienvenue sur SmartCampus','Votre compte étudiant a bien été activé.',FALSE,NOW()),
(3,'Bienvenue sur SmartCampus','Votre compte étudiant a bien été activé.',FALSE,NOW()),
(4,'Bienvenue sur SmartCampus','Votre compte étudiant a bien été activé.',FALSE,NOW()),
(5,'Bienvenue sur SmartCampus','Votre compte étudiant a bien été activé.',FALSE,NOW()),

-- Notifications cours
(1,'Nouvelle note disponible','Une nouvelle note a été publiée en Anatomie.',FALSE,NOW()),
(2,'Nouvelle note disponible','Une nouvelle note a été publiée en Biologie.',FALSE,NOW()),
(3,'Nouvelle note disponible','Une nouvelle note a été publiée en Hygiène hospitalière.',TRUE,NOW()),
(31,'Nouvelle note disponible','Une nouvelle note a été publiée en Pharmacologie.',FALSE,NOW()),
(61,'Nouvelle note disponible','Une nouvelle note a été publiée en Urgences médicales.',FALSE,NOW()),

-- Notifications emploi du temps
(1,'Emploi du temps modifié','Une séance a été ajoutée à votre emploi du temps.',FALSE,NOW()),
(15,'Emploi du temps modifié','Votre salle de cours a été modifiée.',FALSE,NOW()),
(30,'Rappel de séance','Vous avez une séance de soins infirmiers demain matin.',TRUE,NOW()),
(45,'Rappel de séance','Vous avez une séance de psychologie demain matin.',FALSE,NOW()),
(75,'Rappel de séance','Vous avez une séance de gériatrie demain matin.',FALSE,NOW()),

-- Notifications absences
(4,'Absence enregistrée','Une absence a été enregistrée sur votre dossier.',FALSE,NOW()),
(12,'Absence justifiée','Votre justificatif d’absence a été validé.',TRUE,NOW()),
(38,'Absence enregistrée','Une absence a été enregistrée sur votre dossier.',FALSE,NOW()),
(66,'Absence justifiée','Votre justificatif d’absence a été validé.',TRUE,NOW()),

-- Notifications enseignants
(91,'Nouvelle séance','Une nouvelle séance a été ajoutée à votre planning.',FALSE,NOW()),
(92,'Notes à saisir','Des notes doivent être saisies pour votre cours.',FALSE,NOW()),
(93,'Message administratif','L’administration vous a envoyé un message.',FALSE,NOW()),
(94,'Modification de salle','Une salle a été modifiée pour une séance à venir.',TRUE,NOW()),

-- Notifications administrateurs
(103,'Nouvel utilisateur','Un nouvel utilisateur a été ajouté à la plateforme.',FALSE,NOW()),
(104,'Import terminé','Les données de test ont été importées avec succès.',TRUE,NOW()),
(105,'Alerte système','Une vérification de la base de données est recommandée.',FALSE,NOW());