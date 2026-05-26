INSERT INTO messages
(expediteur_id, destinataire_id, sujet, contenu, lu, date_envoi)
VALUES

-- Étudiants → enseignants
(1,91,'Question sur le cours','Bonjour, je souhaite avoir des précisions sur le dernier cours d’anatomie.',TRUE,NOW()),
(2,92,'Absence TP','Je serai absent au TP de demain pour raison médicale.',FALSE,NOW()),
(3,93,'Demande de rendez-vous','Serait-il possible de convenir d’un rendez-vous pour parler de mes résultats ?',FALSE,NOW()),
(4,94,'Question devoir','Je n’ai pas compris les consignes du devoir à rendre.',TRUE,NOW()),
(5,95,'Stage infirmier','Pouvez-vous valider ma convention de stage ?',FALSE,NOW()),

-- Enseignants → étudiants
(91,1,'Réponse cours anatomie','Bonjour, les diapositives seront ajoutées sur la plateforme ce soir.',TRUE,NOW()),
(92,2,'Justificatif absence','Merci de transmettre votre justificatif avant vendredi.',FALSE,NOW()),
(93,3,'Rendez-vous accepté','Bonjour, rendez-vous mardi à 14h dans mon bureau.',FALSE,NOW()),
(94,4,'Consignes devoir','Les consignes détaillées ont été ajoutées dans Moodle.',TRUE,NOW()),
(95,5,'Convention validée','Votre convention de stage a bien été validée.',FALSE,NOW()),

-- Étudiants → administration
(10,103,'Problème connexion','Je rencontre un problème pour accéder à mon espace étudiant.',FALSE,NOW()),
(11,104,'Certificat scolarité','Bonjour, puis-je obtenir un certificat de scolarité ?',TRUE,NOW()),
(12,105,'Erreur emploi du temps','Une erreur apparaît dans mon emploi du temps.',FALSE,NOW()),

-- Administration → étudiants
(103,10,'Support connexion','Votre mot de passe a été réinitialisé.',TRUE,NOW()),
(104,11,'Certificat disponible','Votre certificat de scolarité est disponible.',FALSE,NOW()),
(105,12,'Correction emploi du temps','Le problème a été corrigé.',FALSE,NOW()),

-- Enseignants ↔ administration

(91,103,'Réservation salle','Je souhaite réserver une salle pour un TP supplémentaire.',FALSE,NOW()),
(103,91,'Réponse réservation','La salle B204 est disponible mardi prochain.',TRUE,NOW()),
(92,104,'Ajout étudiants','Pouvez-vous ajouter deux étudiants dans mon groupe TD ?',FALSE,NOW()),
(104,92,'Ajout effectué','Les étudiants ont bien été ajoutés au groupe.',TRUE,NOW()),

-- Messages entre étudiants
(20,21,'Cours anatomie','Tu as compris le dernier chapitre ?',TRUE,NOW()),
(21,20,'Re: Cours anatomie','Oui, je peux t’envoyer mes notes si tu veux.',TRUE,NOW()),
(22,23,'Travail de groupe','On se retrouve à la bibliothèque demain ?',FALSE,NOW()),
(23,22,'Re: Travail de groupe','Oui parfait pour moi.',FALSE,NOW()),

-- Messages divers
(61,99,'Question pédiatrie','Pouvez-vous expliquer le prochain cas clinique ?',FALSE,NOW()),
(99,61,'Cas clinique','Le document sera envoyé demain matin.',FALSE,NOW()),
(75,103,'Carte étudiant','Ma carte étudiante ne fonctionne plus.',FALSE,NOW()),
(103,75,'Carte étudiant','Merci de passer au secrétariat pour un remplacement.',FALSE,NOW());