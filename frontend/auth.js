document.addEventListener("DOMContentLoaded", () => {

    const formulaire = document.getElementById("loginForm");

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

    function connexionReussie(utilisateur) {

        const messageErreur =
            document.getElementById("messageErreur");

        messageErreur.style.color = "green";
        messageErreur.textContent =
            "Connexion réussie !";

        localStorage.setItem(
            "utilisateurConnecte",
            JSON.stringify(utilisateur)
        );

        if (utilisateur.role === "etudiant") {

            window.location.href =
                "espaces/Etudiant/espaceEtudiant.html";

        } else if (utilisateur.role === "enseignant") {

            window.location.href =
                "espaces/Prof/espaceProfesseur.html";

        } else if (utilisateur.role === "admin") {

            window.location.href =
                "espaces/Admin/espaceAdmin.html";
        }
    }

});