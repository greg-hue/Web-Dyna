document.addEventListener("DOMContentLoaded", async () => {

    const utilisateurConnecte = JSON.parse(
        localStorage.getItem("utilisateurConnecte")
    );

    if (!utilisateurConnecte || utilisateurConnecte.role !== "admin") {
        window.location.href = "../../authentification.html";
        return;
    }

    document.getElementById("nomUtilisateur").textContent =
        utilisateurConnecte.prenom + " " + utilisateurConnecte.nom;

    document.getElementById("roleUtilisateur").textContent =
        "Administrateur";

    document.getElementById("btnDeconnexion").addEventListener("click", () => {
        localStorage.removeItem("utilisateurConnecte");
        window.location.href = "../../authentification.html";
    });

    const listeCours = document.getElementById("listeCours");
    const selectEnseignant = document.getElementById("enseignantId");
    const messageCours = document.getElementById("messageCours");

    async function chargerCours() {

        const reponse = await fetch(
            "../../../backend/Admin/getAdminCours.php"
        );

        const resultat = await reponse.json();

        listeCours.innerHTML = "";
        selectEnseignant.innerHTML =
            `<option value="">Choisir un enseignant</option>`;

        if (resultat.success) {

            resultat.enseignants.forEach(enseignant => {
                selectEnseignant.innerHTML += `
                    <option value="${enseignant.id_enseignant}">
                        ${enseignant.prenom} ${enseignant.nom}
                    </option>
                `;
            });

            resultat.cours.forEach(cours => {
                listeCours.innerHTML += `
                    <tr>
                        <td>${cours.titre}</td>
                        <td>${cours.code}</td>
                        <td>${cours.credits}</td>
                        <td>${cours.semestre}</td>
                        <td>${cours.niveau}</td>
                        <td>${cours.capacite_max}</td>
                        <td>${cours.prenom} ${cours.nom}</td>
                        <td>

                        <button onclick="modifierCours(
                            ${cours.id_cours},
                            '${cours.titre}',
                            '${cours.description}',
                            '${cours.id_enseignant}'
                        )">
                            Modifier
                        </button>
                        </td>
                    </tr>
                `;
            });
        }
    }

    document.getElementById("formAjoutCours").addEventListener("submit", async (event) => {

        event.preventDefault();

        const donnees = new FormData();

        donnees.append("titre", document.getElementById("titre").value);
        donnees.append("code", document.getElementById("code").value);
        donnees.append("description", document.getElementById("description").value);
        donnees.append("credits", document.getElementById("credits").value);
        donnees.append("semestre", document.getElementById("semestre").value);
        donnees.append("niveau", document.getElementById("niveau").value);
        donnees.append("capacite_max", document.getElementById("capaciteMax").value);
        donnees.append("enseignant_id", document.getElementById("enseignantId").value);

        const reponse = await fetch(
            "../../../backend/Admin/addAdminCours.php",
            {
                method: "POST",
                body: donnees
            }
        );

        const resultat = await reponse.json();

        if (resultat.success) {
            messageCours.style.color = "green";
            messageCours.textContent = "Cours ajouté.";

            event.target.reset();
            chargerCours();
        } else {
            messageCours.style.color = "red";
            messageCours.textContent = resultat.message;
        }
    });
    window.modifierCours = async function(
    id,
    nom,
    description,
    enseignant
    ) {
    const nouveauNom =
        prompt("Nom du cours :", nom);

    if (nouveauNom === null) return;

    const nouvelleDescription =
        prompt("Description :", description);

    if (nouvelleDescription === null) return;

    const nouvelEnseignant =
        prompt("Enseignant :", enseignant);

    if (nouvelEnseignant === null) return;

    const donnees = new FormData();

    donnees.append("id", id);
    donnees.append("nom", nouveauNom);
    donnees.append("description", nouvelleDescription);
    donnees.append("enseignant", nouvelEnseignant);

    const reponse = await fetch(
        "../../../backend/Admin/updateAdminCours.php",
        {
            method: "POST",
            body: donnees
        }
    );

    const resultat = await reponse.json();

    alert(resultat.message);

    if (resultat.success) {
        chargerCours();
    }
    };
    
    chargerCours();
});