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

    // Paramètres URL
    const parametres =
        new URLSearchParams(window.location.search);

    const idMessage =
        parametres.get("id");

    if (!idMessage) {

        alert("Message introuvable");

        window.location.href =
            "messagerieEtudiant.html";

        return;
    }

    try {

        const reponse = await fetch(
            "../../../backend/getMessage.php?id_message="
            + idMessage
            + "&id_utilisateur="
            + utilisateur.id
        );

        const resultat = await reponse.json();

        if (!resultat.success) {

            alert("Message introuvable");

            window.location.href =
                "messagerieEtudiant.html";

            return;
        }

        const message = resultat.message;

        // Affichage message
        document.getElementById("expediteurMessage")
            .textContent =
            message.expediteur_prenom
            + " "
            + message.expediteur_nom
            + " ("
            + message.expediteur_role
            + ")";

        document.getElementById("sujetMessage")
            .textContent =
            message.sujet;

        document.getElementById("dateMessage")
            .textContent =
            message.date_envoi;

        document.getElementById("contenuMessage")
            .textContent =
            message.contenu;

        // Réponse
        document.getElementById("formReponse")
            .addEventListener("submit", async (event) => {

                event.preventDefault();

                const contenu =
                    document.getElementById(
                        "reponseMessage"
                    ).value;

                const donnees = new FormData();

                donnees.append(
                    "expediteur_id",
                    utilisateur.id
                );

                donnees.append(
                    "destinataire_id",
                    message.expediteur_id
                );

                donnees.append(
                    "sujet",
                    "Re: " + message.sujet
                );

                donnees.append(
                    "contenu",
                    contenu
                );

                const reponseEnvoi = await fetch(
                    "../../../backend/sendMessage.php",
                    {
                        method: "POST",
                        body: donnees
                    }
                );

                const resultatEnvoi =
                    await reponseEnvoi.json();

                const confirmation =
                    document.getElementById(
                        "messageConfirmation"
                    );

                if (resultatEnvoi.success) {

                    confirmation.style.color =
                        "green";

                    confirmation.textContent =
                        "Réponse envoyée";

                    document.getElementById(
                        "formReponse"
                    ).reset();

                } else {

                    confirmation.style.color =
                        "red";

                    confirmation.textContent =
                        "Erreur lors de l'envoi";
                }
            });

    } catch (erreur) {

        console.error(erreur);

        alert("Erreur chargement message");
    }

});