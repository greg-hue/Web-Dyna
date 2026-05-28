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
        "../../../backend/Prof/getProfDashboard.php?id_utilisateur=" + utilisateur.id
    );

    const resultat = await reponse.json();

    if (resultat.success) {

        //stats globales

        if (resultat.stats) {

            document.getElementById("totalCoursSemaine").textContent =
                resultat.stats.total_cours_semaine;

            document.getElementById("totalEtudiants").textContent =
                resultat.stats.total_etudiants;
        }

        //planning des cours

        const planningProf = document.getElementById("planningProf");

        const planning =
            resultat.planning || resultat.cours || [];

        planningProf.innerHTML = "";

        planning.forEach(seance => {

            planningProf.innerHTML += `
                <tr>
                    <td>${seance.date_seance}</td>

                    <td>
                        ${seance.heure_debut}
                        - 
                        ${seance.heure_fin}
                    </td>

                    <td>
                        ${(seance.titre || seance.matiere)}
                        (${seance.groupe || seance.classe || ""})
                    </td>

                    <td>${seance.salle}</td>

                    <td>
                        <button
                            onclick="genererQRCode(${seance.id_seance})"
                            class="btn-action"
                            id_seance="${seance.id_seance}"
                        >
                            Faire l'appel
                        </button>
                    </td>
                </tr>
            `;
        });
    }
});


//genration du qr code pour une seance

window.genererQRCode = async function(idSeance) {

    const formData = new FormData();

    formData.append("id_seance", idSeance);

    const reponse = await fetch(
        "../../../backend/Prof/presence/genererQRSeance.php",
        {
            method: "POST",
            body: formData
        }
    );

    const resultat = await reponse.json();

    if (resultat.success) {

        const zoneQrCode =
            document.getElementById("qrcode");

        // Vider l ancien qr code
        zoneQrCode.innerHTML = "";

        // Carte d affichage
        zoneQrCode.innerHTML = `
            <div class="carte-qrcode">
                
                <h3>
                    ✅ Scannez ce code pour valider votre présence
                </h3>

                <div id="qr-image"></div>

                <p class="code-manuel">
                    Code manuel :
                    <strong class="code-token">
                        ${resultat.token}
                    </strong>
                </p>

            </div>
        `;

        // Generation du qr code
        new QRCode(document.getElementById("qr-image"), {
            text: resultat.token,
            width: 200,
            height: 200
        });

        alert("QR Code généré ! Il expirera dans 15 minutes.");

    } else {

        alert("Erreur : " + resultat.message);
    }
};