document.addEventListener("DOMContentLoaded", async () => {

    //Recup les données de la session
    const utilisateur = JSON.parse(
        localStorage.getItem("utilisateurConnecte")
    );

    //securite pour la connexion de l'utilisateur
    if (!utilisateur || utilisateur.role !== "enseignant") {

        window.location.href =
            "../../../authentification.html";

        return;
    }

    //maj des infos de l'utilisateur
    document.getElementById("nomUtilisateur").textContent =
        utilisateur.prenom + " " + utilisateur.nom;

    document.getElementById("roleUtilisateur").textContent =
        "Professeur";

    //gere la deconnexion avec le bouton
    document.getElementById("btnDeconnexion")
        .addEventListener("click", () => {

            localStorage.removeItem(
                "utilisateurConnecte"
            );

            window.location.href =
                "../../../authentification.html";
    });

    try {

        //Recupere les cours du prof dans le serveur
        const reponse = await fetch(
            "../../../../backend/Prof/getProfCours.php?id_utilisateur="
            + utilisateur.id
        );

        //transforme la reponse du serveur en un objet json lisible
        const resultat = await reponse.json();

        //cible l'html ou on doit inserer les lignes du tableau
        const listeCours =
            document.getElementById("listeCours");

        //Affichage des cours un par un
        if (resultat.success) {

            //vide le tableau avant de le remplir pour eviter les doublons
            listeCours.innerHTML = "";

            resultat.cours.forEach(cours => {

                listeCours.innerHTML += `
                    <tr>
                        <td>${cours.titre}</td>

                        <td>
                            Niveau ${cours.niveau}
                            - Semestre ${cours.semestre}
                        </td>

                        <td>${cours.salle}</td>
                    </tr>
                `;
            });

        //Affiche une erreur si la requete echoue
        } else {

            console.error(
                "Erreur PHP :",
                resultat.message
            );
        }

    //Affiche une erreur en cas de probleme de connexion au serveur
    } catch (e) {

        console.error(
            "Erreur réseau :",
            e
        );
    }
});