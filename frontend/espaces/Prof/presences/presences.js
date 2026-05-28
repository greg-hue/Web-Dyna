document.addEventListener("DOMContentLoaded", async () => {

    const utilisateur = JSON.parse(localStorage.getItem("utilisateurConnecte"));

    if (!utilisateur || utilisateur.role !== "enseignant") {
        window.location.href = "../../../authentification.html";
        return;
    }

    document.getElementById("nomUtilisateur").textContent =
        utilisateur.prenom + " " + utilisateur.nom;

    document.getElementById("roleUtilisateur").textContent =
        "Professeur";

    document.getElementById("btnDeconnexion").addEventListener("click", () => {
        localStorage.removeItem("utilisateurConnecte");
        window.location.href = "../../../authentification.html";
    });





    const selectSeance = document.getElementById("seanceId");
    const selectEtudiant = document.getElementById("etudiantId");
    const listePresences = document.getElementById("listePresences");
    const messagePresence = document.getElementById("messagePresence");

    const btnGenererQR = document.getElementById("btnGenererQR");
    const zoneQrCode = document.getElementById("qrcode");

    let etudiantsParSeance = {};

    function afficherMessage(type, texte) {

        messagePresence.className = "";

        if (type === "success") {

            messagePresence.classList.add(
                "message-success"
            );

        } else {

            messagePresence.classList.add(
                "message-error"
            );
        }

        messagePresence.textContent = texte;
    }


    async function chargerPresences() {

        const reponse = await fetch(
            "../../../../backend/Prof/presence/getProfPresences.php?id_utilisateur=" + utilisateur.id
        );

        const resultat = await reponse.json();

        selectSeance.innerHTML =
            `<option value="">Choisir une séance</option>`;

        selectEtudiant.innerHTML =
            `<option value="">Choisir un étudiant</option>`;

        listePresences.innerHTML = "";

        zoneQrCode.innerHTML = "";

        if (resultat.success) {

            etudiantsParSeance =
                resultat.etudiants_par_seance;

            resultat.seances.forEach(seance => {

                selectSeance.innerHTML += `
                    <option value="${seance.id_seance}">
                        ${seance.date_seance}
                        - ${seance.heure_debut}
                        - ${seance.titre}
                        (${seance.groupe})
                        - ${seance.salle}
                    </option>
                `;
            });


            resultat.absences.forEach(absence => {

                listePresences.innerHTML += `
                    <tr>
                        <td>${absence.date_seance}</td>
                        <td>${absence.prenom} ${absence.nom}</td>
                        <td>${absence.groupe}</td>
                        <td>${absence.titre}</td>
                        <td>${absence.statut}</td>
                        <td>${absence.justifiee == 1 ? "Oui" : "Non"}</td>
                        <td>${absence.commentaire}</td>
                    </tr>
                `;
            });

        } else {

            messagePresence.style.color = "red";
            messagePresence.textContent = resultat.message;
        }
    }

    selectSeance.addEventListener("change", () => {

        const idSeance = selectSeance.value;

        selectEtudiant.innerHTML =
            `<option value="">Choisir un étudiant</option>`;

        zoneQrCode.innerHTML = "";

        if (!idSeance || !etudiantsParSeance[idSeance]) {
            return;
        }

        etudiantsParSeance[idSeance].forEach(etudiant => {

            selectEtudiant.innerHTML += `
                <option value="${etudiant.id_etudiant}">
                    ${etudiant.prenom} ${etudiant.nom}
                    (${etudiant.groupe})
                </option>
            `;
        });
    });

    btnGenererQR.addEventListener(
        "click",
        async () => {

        const idSeance = selectSeance.value;

        if (!idSeance) {

            alert(
                "⚠️ Veuillez sélectionner une séance."
            );

            return;
        }

        const formData = new FormData();

        formData.append(
            "id_seance",
            idSeance
        );

        try {

            const reponse = await fetch(
                "../../../../backend/Prof/presence/genererQRSeance.php",
                {
                    method: "POST",
                    body: formData
                }
            );

            const resultat =
                await reponse.json();

            if (resultat.success) {

                zoneQrCode.innerHTML = "";

                const carte =
                    document.createElement("div");

                carte.className =
                    "carte-qrcode";

                const titre =
                    document.createElement("h3");

                titre.textContent =
                    "✅ L'appel QR Code est lancé !";

                const qrImage =
                    document.createElement("div");

                qrImage.id = "qr-image";

                qrImage.className =
                    "qr-image";

                const texteSecours =
                    document.createElement("p");

                texteSecours.className =
                    "code-manuel";

                texteSecours.innerHTML = `
                    Code de secours manuel :
                    <span class="code-token">
                        ${resultat.token}
                    </span>
                `;

                carte.appendChild(titre);

                carte.appendChild(qrImage);

                carte.appendChild(texteSecours);

                zoneQrCode.appendChild(carte);

                new QRCode(qrImage, {
                    text: resultat.token,
                    width: 200,
                    height: 200
                });

            } else {

                alert(
                    "❌ Erreur lors de la génération : "
                    + resultat.message
                );
            }

        } catch (e) {

            alert(
                "❌ Erreur réseau : Impossible de joindre le serveur."
            );
        }
    });

    document.getElementById("formPresence").addEventListener("submit", async (event) => {

        event.preventDefault();

        if (!selectSeance.value) {

            alert(
                "Veuillez sélectionner une séance."
            );

            return;
        }

        const donnees = new FormData();

        donnees.append("seance_id", selectSeance.value);
        donnees.append("etudiant_id", selectEtudiant.value);
        donnees.append("statut", document.getElementById("statut").value);
        donnees.append("justifiee", document.getElementById("justifiee").value);
        donnees.append("commentaire", document.getElementById("commentaire").value);

        const reponse = await fetch(
            "../../../../backend/Prof/presence/addProfPresence.php",
            {
                method: "POST",
                body: donnees
            }
        );

        const resultat = await reponse.json();

        if (resultat.success) {

            afficherMessage(
                "success",
                "✅ Ajustement enregistré avec succès."
            );

            document.getElementById(
                "commentaire"
            ).value = "";

            messagePresence.style.color = "green";
            messagePresence.textContent =
                "Présence enregistrée.";

            event.target.reset();

            chargerPresences();

        } else {

            afficherMessage(
                "error",
                "❌ " + resultat.message
            );

            messagePresence.style.color = "red";
            messagePresence.textContent =
                resultat.message;
        }
    });

    chargerPresences();
});