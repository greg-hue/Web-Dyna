document.addEventListener("DOMContentLoaded", async () => {

    const utilisateur = JSON.parse(localStorage.getItem("utilisateurConnecte"));

    if (!utilisateur || utilisateur.role !== "enseignant") {
        window.location.href = "../../authentification.html";
        return;
    }

    document.getElementById("nomUtilisateur").textContent =
        utilisateur.prenom + " " + utilisateur.nom;

    document.getElementById("roleUtilisateur").textContent = "Professeur";

    document.getElementById("btnDeconnexion").addEventListener("click", () => {
        localStorage.removeItem("utilisateurConnecte");
        window.location.href = "../../authentification.html";
    });

    const reponse = await fetch(
        "../../../backend/getProfDashboard.php?id_utilisateur=" + utilisateur.id
    );

    const resultat = await reponse.json();

    if (resultat.success) {
        document.getElementById("totalCours").textContent =
            resultat.stats.total_cours;

        document.getElementById("totalEtudiants").textContent =
            resultat.stats.total_etudiants;

        document.getElementById("totalNotes").textContent =
            resultat.stats.total_notes;

        const planningProf = document.getElementById("planningProf");

        resultat.planning.forEach(seance => {
            planningProf.innerHTML += `
                <tr>
                    <td>${seance.date_seance}</td>
                    <td>${seance.heure_debut} - ${seance.heure_fin}</td>
                    <td>${seance.titre} (${seance.groupe})</td>
                    <td>${seance.salle}</td>
                </tr>
            `;
        });
    }
});