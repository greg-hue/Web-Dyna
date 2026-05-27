document.addEventListener("DOMContentLoaded", async () => {

    // =========================
    // Utilisateur connecté
    // =========================

    const utilisateur = JSON.parse(
        localStorage.getItem("utilisateurConnecte")
    );

    // =========================
    // Sécurité
    // =========================

    if (!utilisateur || utilisateur.role !== "etudiant") {

        window.location.href =
            "../../authentification.html";

        return;
    }

    // =========================
    // Informations utilisateur
    // =========================

    document.getElementById("nomUtilisateur")
        .textContent =
        utilisateur.prenom + " " + utilisateur.nom;

    document.getElementById("roleUtilisateur")
        .textContent = "Étudiant";

    // =========================
    // Déconnexion
    // =========================

    document.getElementById("btnDeconnexion")
        .addEventListener("click", () => {

            localStorage.removeItem(
                "utilisateurConnecte"
            );

            window.location.href =
                "../../authentification.html";
        });

    // =========================
    // Chargement dashboard
    // =========================

    try {

        // =====================================
        // EMPLOI DU TEMPS
        // =====================================

        const reponseSeances = await fetch(
            "../../../backend/Etudiant/getEtudiantSeances.php?id_utilisateur="
            + utilisateur.id
        );

        const resultatSeances =
            await reponseSeances.json();

        const listeSeances =
            document.getElementById("listeSeances");

        if (resultatSeances.success) {

            listeSeances.innerHTML = "";

            resultatSeances.seances
                .slice(0, 5)
                .forEach(seance => {

                listeSeances.innerHTML += `
                    <tr>
                        <td>${seance.date_seance}</td>

                        <td>
                            ${seance.heure_debut}
                            -
                            ${seance.heure_fin}
                        </td>

                        <td>${seance.type_seance}</td>

                        <td>${seance.titre}</td>

                        <td>${seance.salle}</td>
                    </tr>
                `;
            });
        }

        // =====================================
        // NOTES
        // =====================================

        const reponseNotes = await fetch(
            "../../../backend/Etudiant/getEtudiantNotes.php?id_utilisateur="
            + utilisateur.id
        );

        const resultatNotes =
            await reponseNotes.json();

        const listeNotes =
            document.getElementById("listeNotes");

        let moyenne = 0;

        let totalCoef = 0;

        if (resultatNotes.success) {

            listeNotes.innerHTML = "";

            resultatNotes.notes
                .slice(0, 3)
                .forEach(note => {

                listeNotes.innerHTML += `
                    <tr>
                        <td>${note.titre}</td>

                        <td>${note.note}</td>

                        <td>${note.coefficient}</td>
                    </tr>
                `;

                moyenne +=
                    parseFloat(note.note)
                    *
                    parseFloat(note.coefficient);

                totalCoef +=
                    parseFloat(note.coefficient);
            });

            if (totalCoef > 0) {

                moyenne = moyenne / totalCoef;

                document.getElementById(
                    "moyenneGenerale"
                ).textContent =
                    moyenne.toFixed(2);
            }

            document.getElementById(
                "nombreControles"
            ).textContent =
                resultatNotes.notes.length;
        }

        // =====================================
        // ABSENCES
        // =====================================

        const reponseAbsences = await fetch(
            "../../../backend/Etudiant/getEtudiantAbsences.php?id_utilisateur="
            + utilisateur.id
        );

        const resultatAbsences =
            await reponseAbsences.json();

        const listeAbsences =
            document.getElementById("listeAbsences");

        if (resultatAbsences.success) {

            listeAbsences.innerHTML = "";

            resultatAbsences.absences
                .slice(0, 3)
                .forEach(absence => {

                listeAbsences.innerHTML += `
                    <tr>
                        <td>
                            ${absence.titre}
                            -
                            ${absence.date_seance}
                        </td>

                        <td>${absence.statut}</td>
                    </tr>
                `;
            });

            document.getElementById(
                "nombreAbsences"
            ).textContent =
                resultatAbsences.absences.length;
        }

    } catch (erreur) {

        console.error(erreur);

        alert(
            "Erreur lors du chargement du dashboard"
        );
    }

});
