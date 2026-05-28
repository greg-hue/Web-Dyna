document.addEventListener("DOMContentLoaded", async () => {

    //Récuperation utilisateur
    const utilisateur = JSON.parse(localStorage.getItem("utilisateurConnecte"));

    //Verif authentification
    if (!utilisateur || utilisateur.role !== "enseignant") {window.location.href = "../../authentification.html";
        return;
    }

    //Affichage utilisateur
    document.getElementById("nomUtilisateur").textContent = utilisateur.prenom + " " + utilisateur.nom;
    document.getElementById("roleUtilisateur").textContent = "Professeur";

    //Déconnexion
    document.getElementById("btnDeconnexion").addEventListener("click", () => {
        localStorage.removeItem("utilisateurConnecte");
        window.location.href = "../../authentification.html";
    });

    //Requête dashboard prof
    const reponse = await fetch("../../../backend/Prof/getProfDashboard.php?id_utilisateur=" + utilisateur.id);
    //conversion JSON
    const resultat = await reponse.json();

    //Données dashboard
    if (resultat.success) {
        document.getElementById("totalCoursSemaine").textContent = resultat.stats.total_cours_semaine;
        document.getElementById("totalEtudiants").textContent = resultat.stats.total_etudiants;

        //Planning des cours
        const planningProf = document.getElementById("planningProf");
        //Ajout des séances
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