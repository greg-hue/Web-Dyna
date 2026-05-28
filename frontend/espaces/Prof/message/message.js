document.addEventListener("DOMContentLoaded", async () => {

    //Recup utilisateur
    const utilisateur = JSON.parse(localStorage.getItem("utilisateurConnecte"));

    //Verif authentification
    if (!utilisateur || utilisateur.role !== "enseignant") {
        window.location.href = "../../../authentification.html";
        return;
    }

    //Affichage utilisateur
    document.getElementById("nomUtilisateur").textContent = utilisateur.prenom + " " + utilisateur.nom;
    document.getElementById("roleUtilisateur").textContent = "Professeur";

    //Déconnexion
    document.getElementById("btnDeconnexion").addEventListener("click", () => {
        localStorage.removeItem("utilisateurConnecte");
        window.location.href = "../../../authentification.html";
    });

    //Recup id message
    const parametres = new URLSearchParams(window.location.search);
    const idMessage = parametres.get("id");
    //Si aucun message séléctionné
    if (!idMessage) {
        alert("Aucun message sélectionné.");
        window.location.href = "messagerie.html";
        return;
    }
    //Requête message
    const reponse = await fetch("../../../../backend/getMessage.php?id_message=" + idMessage + "&id_utilisateur=" + utilisateur.id);
    //conversion json
    const resultat = await reponse.json();
    //si erreur
    if (!resultat.success) {
        alert(resultat.message);
        window.location.href = "messagerie.html";
        return;
    }
    //Affichage message
    const message = resultat.message;
    document.getElementById("expediteurMessage").textContent = message.expediteur_prenom + " " + message.expediteur_nom + " (" + message.expediteur_role + ")";
    document.getElementById("sujetMessage").textContent = message.sujet;
    document.getElementById("dateMessage").textContent = message.date_envoi;
    document.getElementById("contenuMessage").textContent = message.contenu;

    //Reponse message
    const formReponse = document.getElementById("formReponse");
    formReponse.addEventListener("submit", async (event) => {
        //empêche rechargement
        event.preventDefault();
        const contenu = document.getElementById("reponseMessage").value;
        //Création des données
        const donnees = new FormData();
        donnees.append("expediteur_id", utilisateur.id);
        donnees.append("destinataire_email", message.expediteur_email);
        donnees.append("sujet", "Re: " + message.sujet);
        donnees.append("contenu", contenu);
        //envoi de la réponse
        const reponseEnvoi = await fetch("../../../../backend/sendMessage.php",
            {
                method: "POST",
                body: donnees
            }
        );
        const resultatEnvoi = await reponseEnvoi.json();
        const confirmation = document.getElementById("messageConfirmation");
        //si réussi
        if (resultatEnvoi.success) {
            confirmation.style.color = "green";
            confirmation.textContent =
                "Réponse envoyée.";
            formReponse.reset();
        //erreur d"envoi
        } else {
            confirmation.style.color = "red";
            confirmation.textContent =
                "Erreur lors de l'envoi.";
        }
    });
});