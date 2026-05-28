document.addEventListener("DOMContentLoaded", async () => {

    //Recup les données de la session 
    const utilisateur = JSON.parse(localStorage.getItem("utilisateurConnecte"));
    
    //securite pour la connexiond e l'utilisateur
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
    
    //Recupere les eval crées par le prof dans le serveur
    const reponse = await fetch("../../../../backend/Prof/getProfEvaluations.php?id_utilisateur=" + utilisateur.id);
    
    //transforme la reponse du serveur en un objet json lisible
    const resultat = await reponse.json();
    
    //cible l'html ou on doit inserer les lignes du tableau
    const listeEvaluations = document.getElementById("listeEvaluations");

    //Affichage des evaluations une par une
    if (resultat.success) {
        resultat.evaluations.forEach(evaluation => {
            listeEvaluations.innerHTML += `
                <tr>
                    <td>${evaluation.matiere}</td>
                    <td>${evaluation.type_evaluation}</td>
                    <td>${evaluation.date_evaluation}</td>
                </tr>
            `;
        });
    }
});