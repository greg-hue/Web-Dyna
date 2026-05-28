//chargement de la page
document.addEventListener("DOMContentLoaded", () => {

    //Recup du formulaire
    const formulaire = document.getElementById("loginForm");

    //Soumission du formulaire
    formulaire.addEventListener("submit", async (event) => {

        //Emêche recharge auto
        event.preventDefault();

        //Recup des données
        const identifiant = document.getElementById("identifiant").value;
        const motdepasse = document.getElementById("motdepasse").value;
        const role = document.querySelector('input[name="role"]:checked')?.value;

        //Zone de l'affichage des erreurs
        const messageErreur = document.getElementById("messageErreur");
        //Création formdata
        const donnees = new FormData();
        donnees.append("identifiant", identifiant);
        donnees.append("motdepasse", motdepasse);
        donnees.append("role", role);

        //Requête vers backend
        try {
            const reponse = await fetch(
                "../backend/authentification.php",
                {
                    method: "POST",
                    body: donnees
                }
            );

            //Conversion JSON
            const resultat = await reponse.json();
            
            //Connexion réussi
            if (resultat.success) {
                connexionReussie(resultat.utilisateur);

            //Erreur de connexion    
            } else {
                messageErreur.style.color = "red";
                messageErreur.textContent =
                    resultat.message;
            }
        } 

        //Erreur serveur
        catch (erreur) {
            console.error("Erreur :", erreur);
            messageErreur.style.color = "red";
            messageErreur.textContent = "Erreur de connexion au serveur PHP.";
        }
    });

    //Fonction pour connexion réussi
    function connexionReussie(utilisateur) {
        const messageErreur = document.getElementById("messageErreur");
        messageErreur.style.color = "green";
        messageErreur.textContent = "Connexion réussie !";

        //Sauvegarde de la session
        localStorage.setItem("utilisateurConnecte",JSON.stringify(utilisateur));

        //Redirection delon rôle
        if (utilisateur.role === "etudiant") {
            window.location.href = "espaces/Etudiant/espaceEtudiant.html";

        //Prof
        } else if (utilisateur.role === "enseignant") {
            window.location.href = "espaces/Prof/espaceProfesseur.html";

        //admin
        } else if (utilisateur.role === "admin") {

            window.location.href = "espaces/Admin/espaceAdmin.html";
        }
    }
});