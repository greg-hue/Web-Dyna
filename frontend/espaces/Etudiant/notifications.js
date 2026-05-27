document.addEventListener("DOMContentLoaded", async () => {

    const utilisateur = JSON.parse(
        localStorage.getItem("utilisateurConnecte")
    );

    if (!utilisateur || utilisateur.role !== "etudiant") {

        window.location.href =
            "../../authentification.html";

        return;
    }

    document.getElementById("nomUtilisateur").textContent =
        utilisateur.prenom + " " + utilisateur.nom;

    document.getElementById("roleUtilisateur").textContent =
        "Étudiant";

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
            "../../../backend/Etudiant/getEtudiantNotifications.php?id_utilisateur="
            + utilisateur.id
        );

        const resultat = await reponse.json();

        const listeNotifications =
            document.getElementById("listeNotifications");

        if (resultat.success) {

            resultat.notifications.forEach(notification => {

                listeNotifications.innerHTML += `
                    <tr>
                        <td>${notification.titre}</td>
                        <td>${notification.message}</td>
                        <td>
                            ${notification.est_lue == 1
                                ? "Lue"
                                : "Non lue"}
                        </td>
                        <td>${notification.date_creation}</td>
                    </tr>
                `;
            });
        }

    } catch (erreur) {

        console.error(erreur);

        alert("Erreur notifications");
    }

});