document.addEventListener("DOMContentLoaded", async () => {

    // verif qu'un étudiant est connecté
    const utilisateur = JSON.parse(localStorage.getItem("utilisateurConnecte"));

    if (!utilisateur || utilisateur.role !== "etudiant") {
        window.location.href = "../../../authentification.html";
        return;
    }

    //affichage des infos utilisateur
    document.getElementById("nomUtilisateur").textContent = utilisateur.prenom + " " + utilisateur.nom;
    document.getElementById("roleUtilisateur").textContent = "Étudiant";

    //déconnexion
    document.getElementById("btnDeconnexion")
        .addEventListener("click", () => {
            localStorage.removeItem("utilisateurConnecte");
            window.location.href = "../../../authentification.html";
        });

    try {

        //récup des notifications de l'étudiant
        const reponse = await fetch("../../../../backend/Etudiant/getEtudiantNotifications.php?id_utilisateur=" + utilisateur.id);
        const resultat = await reponse.json();
        const listeNotifications = document.getElementById("listeNotifications");

        if (resultat.success) {

            resultat.notifications.forEach(notification => {

                listeNotifications.innerHTML += `
                    <tr>
                        <td>${notification.titre}</td>
                        <td>${notification.message}</td>
                        <td>${notification.date_creation}</td>
                    </tr>
                `;
            });
        }

        //récup des actualités générales
        const reponseNews = await fetch("../../../../backend/getNews.php");
        const resultatNews = await reponseNews.json();

        if (resultatNews.success) {
            resultatNews.news.forEach(news => {

                listeNotifications.innerHTML += `
                    <tr>
                        <td>${news.date_publication}</td>
                        <td>
                            <strong>${news.titre}</strong><br>
                            ${news.contenu}
                        </td>
                    </tr>
                 `;
            });
        }

    } catch (erreur) {

        // gestion des erreurs de chargement
        console.error(erreur);
        alert("Erreur notifications");
    }
});