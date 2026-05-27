document.addEventListener("DOMContentLoaded", async () => {

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

    document.getElementById("nomUtilisateur").textContent =
        utilisateur.prenom + " " + utilisateur.nom;

    document.getElementById("roleUtilisateur").textContent =
        "Étudiant";

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
    // Chargement des messages
    // =========================

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

        alert("Erreur lors du chargement des messages");
    }

    // =========================
    // ENVOI D'UN MESSAGE
    // =========================

    const formMessage =
        document.getElementById("formNouveauMessage");

    if (formMessage) {

        formMessage.addEventListener("submit", async (event) => {

            event.preventDefault();

            const destinataire =
                document.getElementById("destinataireMessage").value;

            const sujet =
                document.getElementById("sujetMessage").value;

            const contenu =
                document.getElementById("contenuMessage").value;

            const donnees = new FormData();

            donnees.append(
                "expediteur_id",
                utilisateur.id
            );

            donnees.append(
                "destinataire_id",
                destinataire
            );

            donnees.append(
                "sujet",
                sujet
            );

            donnees.append(
                "contenu",
                contenu
            );

            try {

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
                    document.getElementById("messageConfirmation");

                if (resultatEnvoi.success) {

                    confirmation.style.color = "green";

                    confirmation.textContent =
                        "Message envoyé avec succès.";

                    formMessage.reset();

                } else {

                    confirmation.style.color = "red";

                    confirmation.textContent =
                        resultatEnvoi.message;
                }

            } catch (erreur) {

                console.error(erreur);

                alert("Erreur lors de l'envoi du message");
            }
        });
    }

});