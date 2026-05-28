document.addEventListener("DOMContentLoaded", async () => {

    //recup utilisateur
    const utilisateur = JSON.parse(localStorage.getItem("utilisateurConnecte"));
    //verif authentification
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
    //Requête messages
    const reponse = await fetch("../../../../backend/Prof/getProfMessages.php?id_utilisateur=" + utilisateur.id);
    //Conversion json
    const resultat = await reponse.json();
    //Tableau html
    const listeMessages = document.getElementById("listeMessages");
    //Affichage des messages
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