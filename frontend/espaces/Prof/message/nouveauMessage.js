document.addEventListener("DOMContentLoaded", () => {

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
    
    //Formulaire pour les messages
    const formulaire = document.getElementById("formMessage");
    formulaire.addEventListener("submit", async (event) => {
        
        //commande qui empêche le rechargement
        event.preventDefault();
        //Création données formulaire
        const donnees = new FormData();

        donnees.append("expediteur_id", utilisateur.id);
        donnees.append("destinataire_email",
        document.getElementById("destinataire").value);
        donnees.append("sujet", 
        document.getElementById("sujet").value);
        donnees.append("contenu", document.getElementById("contenu").value);

        //Envoi le message
        const reponse = await fetch("../../../../backend/sendMessage.php", {
            method: "POST",
            body: donnees
        });

        //recuperation de la donnée et conversion json pour l'utiliser
        const resultat = await reponse.json();
        const messageRetour = document.getElementById("messageRetour");
        
        //on montre quy l'envoi est réussi
        if (resultat.success) {
            messageRetour.style.color = "green";
            messageRetour.textContent = "Message envoyé.";
            formulaire.reset();
        
        //et si il y a une erreur
        } else {
            messageRetour.style.color = "red";
            messageRetour.textContent = resultat.message;
        }
    });
});