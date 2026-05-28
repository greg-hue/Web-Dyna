document.addEventListener("DOMContentLoaded", async () => {

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
    
    //Requête évaluations
    const reponse = await fetch("../../../../backend/Prof/getProfEvaluations.php?id_utilisateur=" + utilisateur.id);
    //conversion json
    const resultat = await reponse.json();
    //tableau html
    const listeEvaluations = document.getElementById("listeEvaluations");

    //Affichage évaluations
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