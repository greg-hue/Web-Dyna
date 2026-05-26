document.addEventListener("DOMContentLoaded", () => {

    // Base utilisateurs temporaire
    const utilisateurs = [
        {
            identifiant: "etudiant1",
            motdepasse: "1234",
            role: "etudiant"
        },
        {
            identifiant: "prof1",
            motdepasse: "abcd",
            role: "professeur"
        },
        {
            identifiant: "admin",
            motdepasse: "admin123",
            role: "admin"
        }
    ];

    // Récupération du formulaire
    const formulaire = document.getElementById("loginForm");

    formulaire.addEventListener("submit", (event) => {

        // Empêche le rechargement de la page
        event.preventDefault();

        // Récupération des valeurs
        const identifiant = document.getElementById("identifiant").value;
        const motdepasse = document.getElementById("motdepasse").value;
        const role = document.querySelector('input[name="role"]:checked')?.value;

        const messageErreur = document.getElementById("messageErreur");

        // Recherche utilisateur
        const utilisateurTrouve = utilisateurs.find(utilisateur =>
            utilisateur.identifiant === identifiant &&
            utilisateur.motdepasse === motdepasse &&
            utilisateur.role === role
        );

        // Vérification
        if (utilisateurTrouve) {

            messageErreur.style.color = "green";
            messageErreur.textContent = "Connexion réussie !";

            // Exemple de redirection
            // window.location.href = "dashboard.html";

            console.log("Utilisateur connecté :", utilisateurTrouve);

        } else {

            messageErreur.style.color = "red";
            messageErreur.textContent =
                "Identifiant, mot de passe ou rôle incorrect.";

        }

    });

});