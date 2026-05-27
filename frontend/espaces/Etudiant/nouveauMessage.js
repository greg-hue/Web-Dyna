document.addEventListener("DOMContentLoaded", () => {

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

    const formulaire =
        document.getElementById("formMessage");

    formulaire.addEventListener("submit", async (event) => {

        event.preventDefault();

        const donnees = new FormData();

        donnees.append(
            "expediteur_id",
            utilisateur.id
        );

        donnees.append(
            "destinataire_id",
            document.getElementById("destinataire").value
        );

        donnees.append(
            "sujet",
            document.getElementById("sujet").value
        );

        donnees.append(
            "contenu",
            document.getElementById("contenu").value
        );

        const reponse = await fetch(
            "../../../backend/sendMessage.php",
            {
                method: "POST",
                body: donnees
            }
        );

        const resultat =
            await reponse.json();

        const messageRetour =
            document.getElementById("messageRetour");

        if (resultat.success) {

            messageRetour.style.color =
                "green";

            messageRetour.textContent =
                "Message envoyé.";

            formulaire.reset();

        } else {

            messageRetour.style.color =
                "red";

            messageRetour.textContent =
                resultat.message;
        }
    });
});