document.addEventListener("DOMContentLoaded", () => {

    const formulaire = document.getElementById("loginForm");

    // =================================================
    // Comptes locaux temporaires
    // =================================================

    const utilisateursLocaux = [

        {
            identifiant: "etudiant1",
            motdepasse: "1234",
            role: "etudiant",
            prenom: "Marie",
            nom: "Dupont"
        },

        {
            identifiant: "prof1",
            motdepasse: "abcd",
            role: "enseignant",
            prenom: "Jean",
            nom: "Martin"
        },

        {
            identifiant: "admin",
            motdepasse: "admin123",
            role: "admin",
            prenom: "Claire",
            nom: "Bernard"
        },
    ];

    formulaire.addEventListener("submit", async (event) => {

        event.preventDefault();

        const identifiant =
            document.getElementById("identifiant").value;

        const motdepasse =
            document.getElementById("motdepasse").value;

        const role =
            document.querySelector(
                'input[name="role"]:checked'
            )?.value;

        const messageErreur =
            document.getElementById("messageErreur");

        // =================================================
        // Vérification comptes locaux
        // =================================================

        const utilisateurLocal = utilisateursLocaux.find(
            utilisateur =>

                utilisateur.identifiant === identifiant &&
                utilisateur.motdepasse === motdepasse &&
                utilisateur.role === role
        );

        // Si trouvé localement
        if (utilisateurLocal) {
            connexionReussie(utilisateurLocal);
            return;
        }

        // =================================================
        // Vérification via PHP / MySQL
        // =================================================

        const donnees = new FormData();

        donnees.append("identifiant", identifiant);
        donnees.append("motdepasse", motdepasse);
        donnees.append("role", role);

        try {

            const reponse = await fetch(
                "../backend/authentification.php",
                {
                    method: "POST",
                    body: donnees
                }
            );

            const resultat = await reponse.json();

            if (resultat.success) {

                connexionReussie(resultat.utilisateur);

            } else {

                messageErreur.style.color = "red";
                messageErreur.textContent =
                    resultat.message;
            }

        } catch (erreur) {

            console.error("Erreur :", erreur);

            messageErreur.style.color = "red";
            messageErreur.textContent =
                "Erreur de connexion au serveur PHP.";
        }

    });

    // =================================================
    // Fonction connexion réussie
    // =================================================

    function connexionReussie(utilisateur) {

        const messageErreur =
            document.getElementById("messageErreur");

        messageErreur.style.color = "green";
        messageErreur.textContent =
            "Connexion réussie !";

        // Sauvegarde session
        localStorage.setItem(
            "utilisateurConnecte",
            JSON.stringify(utilisateur)
        );

        // Redirections selon rôle

        if (utilisateur.role === "etudiant") {

            window.location.href =
                "espaces/Etudiant/espaceEtudiant.html";

        } else if (
            utilisateur.role === "enseignant"
        ) {

            window.location.href =
                "espaces/Prof/espaceProfesseur.html";

        } else if (
            utilisateur.role === "admin"
        ) {

            window.location.href =
                "espaces/Admin/espaceAdmin.html";
        }
    }

});