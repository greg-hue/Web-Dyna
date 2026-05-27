document.addEventListener("DOMContentLoaded", async () => {

    const utilisateurConnecte = JSON.parse(
        localStorage.getItem("utilisateurConnecte")
    );

    if (!utilisateurConnecte || utilisateurConnecte.role !== "admin") {
        window.location.href = "../../../authentification.html";
        return;
    }

    document.getElementById("nomUtilisateur").textContent =
        utilisateurConnecte.prenom + " " + utilisateurConnecte.nom;

    document.getElementById("roleUtilisateur").textContent =
        "Administrateur";

    document.getElementById("btnDeconnexion").addEventListener("click", () => {
        localStorage.removeItem("utilisateurConnecte");
        window.location.href = "../../../authentification.html";
    });

    const listeInscriptions =
        document.getElementById("listeInscriptions");

    const selectEtudiant =
        document.getElementById("etudiantId");

    const selectCours =
        document.getElementById("coursId");

    const messageInscription =
        document.getElementById("messageInscription");

    async function chargerInscriptions() {

        const reponse = await fetch(
            "../../../../backend/Admin/getAdminInscriptions.php"
        );

        const resultat = await reponse.json();

        listeInscriptions.innerHTML = "";

        selectEtudiant.innerHTML =
            `<option value="">Choisir un étudiant</option>`;

        selectCours.innerHTML =
            `<option value="">Choisir un cours</option>`;

        if (resultat.success) {

            resultat.etudiants.forEach(etudiant => {
                selectEtudiant.innerHTML += `
                    <option value="${etudiant.id_etudiant}">
                        ${etudiant.prenom} ${etudiant.nom} - ${etudiant.groupe}
                    </option>
                `;
            });

            resultat.cours.forEach(cours => {
                selectCours.innerHTML += `
                    <option value="${cours.id_cours}">
                        ${cours.titre} (${cours.code})
                    </option>
                `;
            });

            resultat.inscriptions.forEach(inscription => {
                listeInscriptions.innerHTML += `
                    <tr>
                        <td>${inscription.prenom} ${inscription.nom}</td>
                        <td>${inscription.groupe}</td>
                        <td>${inscription.titre} (${inscription.code})</td>
                        <td>${inscription.date_inscription}</td>
                        <td>${inscription.statut}</td>
                        <td>
                            <button onclick="supprimerInscription(${inscription.id_inscription})">
                                Supprimer
                            </button>
                        </td>
                    </tr>
                `;
            });
        }
    }

    document.getElementById("formAjoutInscription").addEventListener("submit", async (event) => {

        event.preventDefault();

        const donnees = new FormData();

        donnees.append("etudiant_id", selectEtudiant.value);
        donnees.append("cours_id", selectCours.value);

        const reponse = await fetch(
            "../../../../backend/Admin/addAdminInscription.php",
            {
                method: "POST",
                body: donnees
            }
        );

        const resultat = await reponse.json();

        if (resultat.success) {
            messageInscription.style.color = "green";
            messageInscription.textContent = "Inscription ajoutée.";

            event.target.reset();
            chargerInscriptions();
        } else {
            messageInscription.style.color = "red";
            messageInscription.textContent = resultat.message;
        }
    });

    window.supprimerInscription = async function(idInscription) {

        if (!confirm("Supprimer cette inscription ?")) {
            return;
        }

        const donnees = new FormData();
        donnees.append("id_inscription", idInscription);

        const reponse = await fetch(
            "../../../../backend/Admin/deleteAdminInscription.php",
            {
                method: "POST",
                body: donnees
            }
        );

        const resultat = await reponse.json();

        if (resultat.success) {
            messageInscription.style.color = "green";
            messageInscription.textContent = "Inscription supprimée.";
            chargerInscriptions();
        } else {
            messageInscription.style.color = "red";
            messageInscription.textContent = resultat.message;
        }
    };

    chargerInscriptions();
});