document.addEventListener("DOMContentLoaded", () => {
    const formulaire = document.getElementById("loginForm");
    const messageErreur = document.getElementById("messageErreur");

    formulaire.addEventListener("submit", async (event) => {
        event.preventDefault();

        const donnees = new FormData();

        donnees.append("identifiant", document.getElementById("identifiant").value);
        donnees.append("motdepasse", document.getElementById("motdepasse").value);

        const roleSelectionne = document.querySelector('input[name="role"]:checked');
        donnees.append("role", roleSelectionne.value);

        const reponse = await fetch("../backend/connexion.php", {
            method: "POST",
            body: donnees
        });

        const resultat = await reponse.json();

        if (resultat.success) {
            localStorage.setItem(
                "utilisateurConnecte",
                JSON.stringify(resultat.utilisateur)
            );

            if (resultat.utilisateur.role === "etudiant") {
                window.location.href = "espaces/espaceEtudiant.html";
            } else if (resultat.utilisateur.role === "enseignant") {
                window.location.href = "espaces/espaceProfesseur.html";
            } else if (resultat.utilisateur.role === "admin") {
                window.location.href = "espaces/espaceAdmin.html";
            }
        } else {
            messageErreur.style.color = "red";
            messageErreur.textContent = resultat.message;
        }
    });
});