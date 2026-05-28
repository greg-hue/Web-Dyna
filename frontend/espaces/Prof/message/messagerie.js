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
    
    //Recupere les messages du prof dans le serveur
    const reponse = await fetch("../../../../backend/Prof/getProfMessages.php?id_utilisateur=" + utilisateur.id);
    
    //transforme la reponse du serveur en un objet json lisible
    const resultat = await reponse.json();
    
    //cible l'html ou on doit inserer les lignes du tableau
    const listeMessages = document.getElementById("listeMessages");
    
    //Affichage des messages un par un en les rendant cliquables
    if (resultat.success) {
        resultat.messages.forEach(message => {
            listeMessages.innerHTML += `
                <tr 
                    onclick="window.location.href='message.html?id=${message.id_message}'"
                    style="cursor:pointer;"
                >
                    <td>${message.expediteur_prenom} ${message.expediteur_nom}</td>
                    <td>${message.sujet}</td>
                    <td>${message.date_envoi}</td>
                </tr>
            `;
        });
    }
});