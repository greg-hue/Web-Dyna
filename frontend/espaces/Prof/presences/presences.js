document.addEventListener("DOMContentLoaded", async () => {

    const utilisateur = JSON.parse(localStorage.getItem("utilisateurConnecte"));

    if (!utilisateur || utilisateur.role !== "enseignant") {
        window.location.href = "../../../authentification.html";
        return;
    }

    document.getElementById("nomUtilisateur").textContent =
        utilisateur.prenom + " " + utilisateur.nom;

    document.getElementById("roleUtilisateur").textContent =
        "Professeur";

    document.getElementById("btnDeconnexion").addEventListener("click", () => {
        localStorage.removeItem("utilisateurConnecte");
        window.location.href = "../../../authentification.html";
    });





    const selectSeance = document.getElementById("seanceId");
    const selectEtudiant = document.getElementById("etudiantId");
    const listePresences = document.getElementById("listePresences");
    const messagePresence = document.getElementById("messagePresence");

    let etudiantsParSeance = {};





    async function chargerPresences() {

        const reponse = await fetch(
            "../../../../backend/Prof/presence/getProfPresences.php?id_utilisateur=" + utilisateur.id
        );

        const resultat = await reponse.json();

        selectSeance.innerHTML =
            `<option value="">Choisir une séance</option>`;

        selectEtudiant.innerHTML =
            `<option value="">Choisir un étudiant</option>`;

        listePresences.innerHTML = "";





        if (resultat.success) {

            etudiantsParSeance =
                resultat.etudiants_par_seance;





            /* =========================
               SÉANCES
            ========================= */

            resultat.seances.forEach(seance => {

                selectSeance.innerHTML += `
                    <option value="${seance.id_seance}">
                        ${seance.date_seance}
                        - ${seance.heure_debut}
                        - ${seance.titre}
                        (${seance.groupe})
                        - ${seance.salle}
                    </option>
                `;
            });





            /* =========================
               ABSENCES
            ========================= */

            resultat.absences.forEach(absence => {

                listePresences.innerHTML += `
                    <tr>
                        <td>${absence.date_seance}</td>
                        <td>${absence.prenom} ${absence.nom}</td>
                        <td>${absence.groupe}</td>
                        <td>${absence.titre}</td>
                        <td>${absence.statut}</td>
                        <td>${absence.justifiee == 1 ? "Oui" : "Non"}</td>
                        <td>${absence.commentaire}</td>
                    </tr>
                `;
            });

        } else {

            messagePresence.style.color = "red";
            messagePresence.textContent = resultat.message;
        }
    }





    /* =========================
       CHANGEMENT DE SÉANCE
    ========================= */

    selectSeance.addEventListener("change", () => {

        const idSeance = selectSeance.value;

        selectEtudiant.innerHTML =
            `<option value="">Choisir un étudiant</option>`;

        if (!idSeance || !etudiantsParSeance[idSeance]) {
            return;
        }

        etudiantsParSeance[idSeance].forEach(etudiant => {

            selectEtudiant.innerHTML += `
                <option value="${etudiant.id_etudiant}">
                    ${etudiant.prenom} ${etudiant.nom}
                    (${etudiant.groupe})
                </option>
            `;
        });
    });





    /* =========================
       ENREGISTREMENT
    ========================= */

    document.getElementById("formPresence").addEventListener("submit", async (event) => {

        event.preventDefault();

        const donnees = new FormData();

        donnees.append("seance_id", selectSeance.value);
        donnees.append("etudiant_id", selectEtudiant.value);
        donnees.append("statut", document.getElementById("statut").value);
        donnees.append("justifiee", document.getElementById("justifiee").value);
        donnees.append("commentaire", document.getElementById("commentaire").value);

        const reponse = await fetch(
            "../../../../backend/Prof/presence/addProfPresence.php",
            {
                method: "POST",
                body: donnees
            }
        );

        const resultat = await reponse.json();

        if (resultat.success) {

            messagePresence.style.color = "green";
            messagePresence.textContent =
                "Présence enregistrée.";

            event.target.reset();

            chargerPresences();

        } else {

            messagePresence.style.color = "red";
            messagePresence.textContent =
                resultat.message;
        }
    });





    chargerPresences();
});