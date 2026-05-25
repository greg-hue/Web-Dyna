UTILISATEURS(id_utilisateur, prenom, nom, email, mot_de_passe, role, telephone, date_creation)

ETUDIANTS(id_etudiant, utilisateur_id#, numero_etudiant, promotion, niveau, date_naissance, adresse, contact_urgence)

ENSEIGNANTS(id_enseignant, utilisateur_id#, specialisation, date_embauche)

ADMINISTRATEURS(id_admin, utilisateur_id#)

COURS(id_cours, titre, description, semestre, niveau, capacite_max, enseignant_id#)

INSCRIPTIONS(id_inscription, etudiant_id#, cours_id#, date_inscription, statut)

NOTES(id_note, etudiant_id#, cours_id#, type_evaluation, note, coefficient, date_creation, validee)

EMPLOIS_DU_TEMPS(id_emploi, cours_id#, salle, jour_semaine, heure_debut, heure_fin)

ABSENCES(id_absence, etudiant_id#, cours_id#, date_absence, justifiee, commentaire)

NOTIFICATIONS(id_notification, utilisateur_id#, titre, message, est_lue, date_creation)

MESSAGES(id_message, expediteur_id#, destinataire_id#, contenu, date_envoi)