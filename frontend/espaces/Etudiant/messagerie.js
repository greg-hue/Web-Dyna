document.addEventListener("DOMContentLoaded", async () => {

    const utilisateur = JSON.parse(
        localStorage.getItem("utilisateurConnecte")
    );

    // Sécurité
    if (!utilisateur || utilisateur.role !== "etudiant") {

        window.location.href =
            "../../authentification.html";

        return;
    }

    // Informations utilisateur
    document.getElementById("nomUtilisateur").textContent =
        utilisateur.prenom + " " + utilisateur.nom;

    document.getElementById("roleUtilisateur").textContent =
        "Étudiant";

    // Déconnexion
    document.getElementById("btnDeconnexion")
        .addEventListener("click", () => {

            localStorage.removeItem(
                "utilisateurConnecte"
            );

            window.location.href =
                "../../authentification.html";
        });

    try {

        const reponse = await fetch(
            "../../../backend/Etudiant/getEtudiantMessages.php?id_utilisateur="
            + utilisateur.id
        );

        const resultat = await reponse.json();

        const listeMessages =
            document.getElementById("listeMessages");

        listeMessages.innerHTML = "";

        if (resultat.success) {

            resultat.messages.forEach(message => {

                listeMessages.innerHTML += `
                    <tr>

                        <td>
                            ${message.prenom}
                            ${message.nom}
                        </td>

                        <td>
                            <a href="messageEtudiant.html?id=${message.id_message}">
                                ${message.sujet}
                            </a>
                        </td>

                        <td>${message.date_envoi}</td>

                    </tr>
                `;
            });
        }

    } catch (erreur) {

        console.error(erreur);

        alert("Erreur messagerie");
    }

});