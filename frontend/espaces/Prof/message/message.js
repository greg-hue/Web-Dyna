document.addEventListener("DOMContentLoaded", async () => {

    //Recup les données de la session
    const utilisateur = JSON.parse(localStorage.getItem("utilisateurConnecte"));

    //securite pour la connexion de l'utilisateur
    if (!utilisateur || utilisateur.role !== "enseignant") {
        window.location.href = "../../../authentification.html";
        return;
    }

    //maj des infos de l'utilisateur
    document.getElementById("nomUtilisateur").textContent = utilisateur.prenom + " " + utilisateur.nom;
    document.getElementById("roleUtilisateur").textContent = "Professeur";

    //gere la deconnexion avec le bouton
    document.getElementById("btnDeconnexion").addEventListener("click", () => {
        localStorage.removeItem("utilisateurConnecte");
        window.location.href = "../../../authentification.html";
    });

    //Recupere l'id du message dans l'url
    const parametres = new URLSearchParams(window.location.search);
    const idMessage = parametres.get("id");
    
    //securite si aucun message n'est selectionne
    if (!idMessage) {
        alert("Aucun message sélectionné.");
        window.location.href = "messagerie.html";
        return;
    }
    
    //Recupere le message dans le serveur
    const reponse = await fetch("../../../../backend/getMessage.php?id_message=" + idMessage + "&id_utilisateur=" + utilisateur.id);
    
    //transforme la reponse du serveur en un objet json lisible
    const resultat = await reponse.json();
    
    //erreur si la requete echoue
    if (!resultat.success) {
        alert(resultat.message);
        window.location.href = "messagerie.html";
        return;
    }
    
    //Affichage des infos du message
    const message = resultat.message;
    document.getElementById("expediteurMessage").textContent = message.expediteur_prenom + " " + message.expediteur_nom + " (" + message.expediteur_role + ")";
    document.getElementById("sujetMessage").textContent = message.sujet;
    document.getElementById("dateMessage").textContent = message.date_envoi;
    document.getElementById("contenuMessage").textContent = message.contenu;

    //gere l'envoi de la reponse
    const formReponse = document.getElementById("formReponse");
    formReponse.addEventListener("submit", async (event) => {
        
        //empeche le rechargement de la page
        event.preventDefault();
        const contenu = document.getElementById("reponseMessage").value;

        //Creation des donnees a envoyer
        const donnees = new FormData();
        donnees.append("expediteur_id", utilisateur.id);
        donnees.append("destinataire_email", message.expediteur_email);
        donnees.append("sujet", "Re: " + message.sujet);
        donnees.append("contenu", contenu);
        
        //Envoi de la reponse au serveur
        const reponseEnvoi = await fetch("../../../../backend/sendMessage.php",
            {
                method: "POST",
                body: donnees
            }
        );

        //transforme la reponse du serveur en un objet json lisible
        const resultatEnvoi = await reponseEnvoi.json();
        const confirmation = document.getElementById("messageConfirmation");
        
        //Affichage si c'est reussi
        if (resultatEnvoi.success) {
            confirmation.style.color = "green";
            confirmation.textContent =
                "Réponse envoyée.";
            formReponse.reset();
       
        //Affichage si l'envoi echoue
        } else {
            confirmation.style.color = "red";
            confirmation.textContent =
                "Erreur lors de l'envoi.";
        }
    });
});