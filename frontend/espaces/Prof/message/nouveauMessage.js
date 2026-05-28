document.addEventListener("DOMContentLoaded", () => {

    //Recup utilisateur
    const utilisateur = JSON.parse(localStorage.getItem("utilisateurConnecte"));
    //verif utilisateur
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
    //Formulaire message
    const formulaire = document.getElementById("formMessage");
    formulaire.addEventListener("submit", async (event) => {
        //empêche rechargement
        event.preventDefault();
        //Création données formulaire
        const donnees = new FormData();

        donnees.append("expediteur_id", utilisateur.id);
        donnees.append("destinataire_email",
        document.getElementById("destinataire").value);
        donnees.append("sujet", 
        document.getElementById("sujet").value);
        donnees.append("contenu", document.getElementById("contenu").value);

        //Envoi message
        const reponse = await fetch("../../../../backend/sendMessage.php", {
            method: "POST",
            body: donnees
        });
        //Conversion json
        const resultat = await reponse.json();
        const messageRetour = document.getElementById("messageRetour");
        //envoi réussi
        if (resultat.success) {
            messageRetour.style.color = "green";
            messageRetour.textContent = "Message envoyé.";
            formulaire.reset();
        //si erreur
        } else {
            messageRetour.style.color = "red";
            messageRetour.textContent = resultat.message;
        }
    });
});