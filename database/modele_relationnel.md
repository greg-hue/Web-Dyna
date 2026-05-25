UTILISATEURS(id_utilisateur, prenom, nom, email, mot_de_passe, role, telephone, date_creation)

ETUDIANTS(id_etudiant, utilisateur_id#, numero_etudiant, promotion, niveau, groupe, date_naissance, adresse, contact_urgence)

ENSEIGNANTS(id_enseignant, utilisateur_id#, specialisation, date_embauche)

ADMINISTRATEURS(id_admin, utilisateur_id#)

COURS(id_cours, titre, code, description, credits, semestre, niveau, capacite_max, enseignant_id#)

INSCRIPTIONS(id_inscription, etudiant_id#, cours_id#, date_inscription, statut)

NOTES(id_note, etudiant_id#, cours_id#, type_evaluation, note, coefficient, date_creation, validee)

SEANCES(id_seance, cours_id#, date_seance, heure_debut, heure_fin, salle, type_seance)

ABSENCES(id_absence, etudiant_id#, seance_id#, statut, justifiee, commentaire)

NOTIFICATIONS(id_notification, utilisateur_id#, titre, message, est_lue, date_creation)

MESSAGES(id_message, expediteur_id#, destinataire_id#, sujet, contenu, lu, date_envoi)

NEWS(id_news, auteur_id#, titre, contenu, categorie, date_publication)