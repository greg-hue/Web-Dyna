document.addEventListener("DOMContentLoaded", () => {

    // Base utilisateurs temporaire
    const utilisateurs = [
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
        role: "professeur",
        prenom: "Jean",
        nom: "Martin"
    },
    {
        identifiant: "admin",
        motdepasse: "admin123",
        role: "admin",
        prenom: "Claire",
        nom: "Bernard"
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

            // Sauvegarde des infos utilisateur
            localStorage.setItem(
            "utilisateurConnecte",
            JSON.stringify(utilisateurTrouve)
        );

        // Redirection selon le rôle
        if (utilisateurTrouve.role === "etudiant") {
            window.location.href = "espaces/espaceEtudiant.html";
        }
        else if (utilisateurTrouve.role === "professeur") {
            window.location.href = "espaces/espaceProfesseur.html";
        }
        else if (utilisateurTrouve.role === "admin") {
            window.location.href = "espaces/espaceAdmin.html";
        }

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