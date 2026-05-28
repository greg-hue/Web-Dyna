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

    const liste = document.getElementById("listeUtilisateurs");
    const messageUtilisateur = document.getElementById("messageUtilisateur");

    async function chargerUtilisateurs() {

        const reponse = await fetch(
            "../../../../backend/Admin/utilisateur/getAdminUtilisateurs.php"
        );

        const resultat = await reponse.json();

        liste.innerHTML = "";

        if (resultat.success) {

            resultat.utilisateurs.forEach(utilisateur => {

                liste.innerHTML += `
                    <tr>
                        <td>${utilisateur.prenom} ${utilisateur.nom}</td>
                        <td>${utilisateur.email}</td>
                        <td>${utilisateur.role}</td>
                        <td>${utilisateur.date_creation}</td>
                        <td>
                            <button onclick="modifierUtilisateur(
                                ${utilisateur.id_utilisateur},
                                '${utilisateur.prenom}',
                                '${utilisateur.nom}',
                                '${utilisateur.email}',
                                '${utilisateur.role}'
                            )">
                                Modifier
                            </button>

                            <button onclick="supprimerUtilisateur(${utilisateur.id_utilisateur})">
                                Supprimer
                            </button>
                        </td>
                    </tr>
                `;
            });
        }
    }

    document.getElementById("formAjoutUtilisateur").addEventListener("submit", async (event) => {

        event.preventDefault();

        const donnees = new FormData();

        donnees.append("prenom", document.getElementById("prenom").value);
        donnees.append("nom", document.getElementById("nom").value);
        donnees.append("email", document.getElementById("email").value);
        donnees.append("mot_de_passe", document.getElementById("motDePasse").value);
        donnees.append("role", document.getElementById("role").value);

        const reponse = await fetch(
            "../../../../backend/Admin/utilisateur/addAdminUtilisateur.php",
            {
                method: "POST",
                body: donnees
            }
        );

        const resultat = await reponse.json();

        if (resultat.success) {
            messageUtilisateur.style.color = "green";
            messageUtilisateur.textContent = "Utilisateur ajouté.";

            event.target.reset();
            chargerUtilisateurs();
        } else {
            messageUtilisateur.style.color = "red";
            messageUtilisateur.textContent = resultat.message;
        }
    });

    window.supprimerUtilisateur = async function(idUtilisateur) {

        if (!confirm("Supprimer cet utilisateur ?")) {
            return;
        }

        const donnees = new FormData();
        donnees.append("id_utilisateur", idUtilisateur);

        const reponse = await fetch(
            "../../../../backend/Admin/utilisateur/deleteAdminUtilisateur.php",
            {
                method: "POST",
                body: donnees
            }
        );

        const resultat = await reponse.json();

        if (resultat.success) {
            messageUtilisateur.style.color = "green";
            messageUtilisateur.textContent = "Utilisateur supprimé.";
            chargerUtilisateurs();
        } else {
            messageUtilisateur.style.color = "red";
            messageUtilisateur.textContent = resultat.message;
        }
    };

    window.modifierUtilisateur = async function(
        id,
        prenom,
        nom,
        email,
        role
    ) {

        const nouveauPrenom = prompt("Prénom :", prenom);
        if (nouveauPrenom === null) return;

        const nouveauNom = prompt("Nom :", nom);
        if (nouveauNom === null) return;

        const nouvelEmail = prompt("Email :", email);
        if (nouvelEmail === null) return;

        const nouveauRole = prompt(
            "Rôle (etudiant / enseignant / admin) :",
            role
        );
        if (nouveauRole === null) return;

        const donnees = new FormData();

        donnees.append("id", id);
        donnees.append("prenom", nouveauPrenom);
        donnees.append("nom", nouveauNom);
        donnees.append("email", nouvelEmail);
        donnees.append("role", nouveauRole);

        const reponse = await fetch(
            "../../../../backend/Admin/utilisateur/updateAdminUtilisateur.php",
            {
                method: "POST",
                body: donnees
            }
        );

        const resultat = await reponse.json();

        if (resultat.success) {
            messageUtilisateur.style.color = "green";
            messageUtilisateur.textContent = "Utilisateur modifié.";
            chargerUtilisateurs();
        } else {
            messageUtilisateur.style.color = "red";
            messageUtilisateur.textContent = resultat.message;
        }
    };

    chargerUtilisateurs();
});