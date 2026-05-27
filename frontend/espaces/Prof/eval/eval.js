document.addEventListener("DOMContentLoaded", async () => {

    const utilisateur = JSON.parse(localStorage.getItem("utilisateurConnecte"));

    if (!utilisateur || utilisateur.role !== "enseignant") {
        window.location.href = "../../../authentification.html";
        return;
    }

    document.getElementById("nomUtilisateur").textContent =
        utilisateur.prenom + " " + utilisateur.nom;

    document.getElementById("roleUtilisateur").textContent = "Professeur";

    document.getElementById("btnDeconnexion").addEventListener("click", () => {
        localStorage.removeItem("utilisateurConnecte");
        window.location.href = "../../../authentification.html";
    });

    const reponse = await fetch(
        "../../../../backend/Prof/getProfEvaluations.php?id_utilisateur=" + utilisateur.id
    );

    const resultat = await reponse.json();

    const listeEvaluations = document.getElementById("listeEvaluations");

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