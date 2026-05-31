document.addEventListener("DOMContentLoaded", () => {

    // verif qu'un étudiant est connecté
    const utilisateur = JSON.parse(localStorage.getItem("utilisateurConnecte"));

    if (!utilisateur || utilisateur.role !== "etudiant") {
        window.location.href = "../../../authentification.html";
        return;
    }

    //affichage des informations utilisateur
    document.getElementById("nomUtilisateur").textContent = utilisateur.prenom + " " + utilisateur.nom;

    document.getElementById("roleUtilisateur").textContent = "Étudiant";

    // Déconnexion
    document.getElementById("btnDeconnexion")
        .addEventListener("click", () => {
            localStorage.removeItem("utilisateurConnecte");
            window.location.href = "../../../authentification.html";
        });

    //gestion de l'envoi du formulaire
    const formulaire = document.getElementById("formMessage");
    formulaire.addEventListener("submit", async (event) => {

        event.preventDefault();
        const donnees = new FormData();

        donnees.append(
            "expediteur_id",
            utilisateur.id
        );

        donnees.append(
            "destinataire_email",
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

        // Envoi du message au serveur
        const reponse = await fetch("../../../../backend/sendMessage.php",
            {
                method: "POST",
                body: donnees
            }
        );

        const resultat = await reponse.json();
        const messageRetour = document.getElementById("messageRetour");

        if (resultat.success) {
            messageRetour.style.color = "green";
            messageRetour.textContent = "Message envoyé.";
            formulaire.reset();

        } else {

            messageRetour.style.color = "red";
            messageRetour.textContent = resultat.message;
        }
    });
});