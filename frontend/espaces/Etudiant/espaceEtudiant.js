document.addEventListener("DOMContentLoaded", async () => {

    const utilisateur = JSON.parse(
        localStorage.getItem("utilisateurConnecte")
    );

    if (!utilisateur || utilisateur.role !== "etudiant") {

        window.location.href =
            "../../authentification.html";

        return;
    }


    document.getElementById("nomUtilisateur")
        .textContent =
        utilisateur.prenom + " " + utilisateur.nom;

    document.getElementById("roleUtilisateur")
        .textContent = "Étudiant";


    document.getElementById("btnDeconnexion")
        .addEventListener("click", () => {

            localStorage.removeItem(
                "utilisateurConnecte"
            );

            window.location.href =
                "../../authentification.html";
        });


    let toutesLesSeances = [];
    let toutesLesNotes = [];
    let datePivot = new Date(); 


    try {

        const reponseSeances = await fetch(
            "../../../backend/Etudiant/getEtudiantSeances.php?id_utilisateur="
            + utilisateur.id
        );

        const resultatSeances =
            await reponseSeances.json();

        const listeSeances =
            document.getElementById("listeSeances");

        if (resultatSeances.success) {

            listeSeances.innerHTML = "";

            toutesLesSeances = resultatSeances.seances;

            if (toutesLesSeances.length > 0) {
                datePivot = new Date(toutesLesSeances[0].date_seance);
            }

            resultatSeances.seances
                .slice(0, 5)
                .forEach(seance => {

                listeSeances.innerHTML += `
                    <tr>
                        <td>${seance.date_seance}</td>

                        <td>
                            ${seance.heure_debut}
                            -
                            ${seance.heure_fin}
                        </td>

                        <td>${seance.type_seance}</td>

                        <td>${seance.titre}</td>

                        <td>${seance.salle}</td>
                    </tr>
                `;
            });
        }

        // =====================================
        // NOTES
        // =====================================

        const reponseNotes = await fetch(
            "../../../backend/Etudiant/getEtudiantNotes.php?id_utilisateur="
            + utilisateur.id
        );

        const resultatNotes =
            await reponseNotes.json();

        const listeNotes =
            document.getElementById("listeNotes");

        let moyenne = 0;
        let totalCoef = 0;

        if (resultatNotes.success) {
            toutesLesNotes = resultatNotes.notes;
            listeNotes.innerHTML = "";

            resultatNotes.notes
                .slice(0, 3)
                .forEach(note => {

                listeNotes.innerHTML += `
                    <tr>
                        <td>${note.titre}</td>

                        <td>${note.note}</td>

                        <td>${note.coefficient}</td>
                    </tr>
                `;

                moyenne +=
                    parseFloat(note.note)
                    *
                    parseFloat(note.coefficient);

                totalCoef +=
                    parseFloat(note.coefficient);
            });

            if (totalCoef > 0) {

                moyenne = moyenne / totalCoef;

                document.getElementById(
                    "moyenneGenerale"
                ).textContent =
                    moyenne.toFixed(2);
            }

            document.getElementById(
                "nombreControles"
            ).textContent =
                resultatNotes.notes.length;
        }

        // =====================================
        // ABSENCES
        // =====================================

        const reponseAbsences = await fetch(
            "../../../backend/Etudiant/getEtudiantAbsences.php?id_utilisateur="
            + utilisateur.id
        );

        const resultatAbsences =
            await reponseAbsences.json();

        const listeAbsences =
            document.getElementById("listeAbsences");

        if (resultatAbsences.success) {

            listeAbsences.innerHTML = "";

            resultatAbsences.absences
                .slice(0, 3)
                .forEach(absence => {

                listeAbsences.innerHTML += `
                    <tr>
                        <td>
                            ${absence.titre}
                            -
                            ${absence.date_seance}
                        </td>

                        <td>${absence.statut}</td>
                    </tr>
                `;
            });

            document.getElementById(
                "nombreAbsences"
            ).textContent =
                resultatAbsences.absences.length;
        }
        actualiserSemaineDynamique();

    } catch (erreur) {

        console.error(erreur);

        alert(
            "Erreur lors du chargement du dashboard"
        );
    }
    
function obtenirLimitesSemaine(date) {

    const jour = date.getDay();
    const distanceAuLundi = (jour === 0) ? -6 : 1 - jour;

    const lundi = new Date(date);
    lundi.setDate(date.getDate() + distanceAuLundi);
    lundi.setHours(0, 0, 0, 0);

    const dimanche = new Date(lundi);
    dimanche.setDate(lundi.getDate() + 6);
    dimanche.setHours(23, 59, 59, 999);

    return { lundi, dimanche };
}

function formaterDateCourte(date) {

    const j = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");

    return `${j}/${m}`;
}

function appliquerMessage(type, texte) {

    messageZone.className = "";

    switch(type) {

        case "success":
            messageZone.classList.add("message-success");
            break;

        case "error":
            messageZone.classList.add("message-erreur");
            break;

        case "warning":
            messageZone.classList.add("message-attention");
            break;

        case "info":
            messageZone.classList.add("message-info");
            break;
    }

    messageZone.textContent = texte;
}

function actualiserSemaineDynamique() {

    const { lundi, dimanche } = obtenirLimitesSemaine(datePivot);

    document.getElementById("labelSemaine").textContent =
        `Du ${formaterDateCourte(lundi)} au ${formaterDateCourte(dimanche)}`;

    const listeSeances = document.getElementById("listeSeances");

    listeSeances.innerHTML = "";

    const seancesDeLaSemaine = toutesLesSeances.filter(seance => {

        const dateSeance = new Date(seance.date_seance);

        return dateSeance >= lundi && dateSeance <= dimanche;
    });

    if (seancesDeLaSemaine.length === 0) {

        listeSeances.innerHTML = `
            <tr>
                <td colspan="5" class="message-vide">
                    Aucun cours planifié pour cette semaine.
                </td>
            </tr>
        `;

    } else {

        let dateActuelle = null;

        seancesDeLaSemaine.forEach(seance => {

            if (seance.date_seance !== dateActuelle) {

                dateActuelle = seance.date_seance;

                listeSeances.innerHTML += `
                    <tr class="ligne-jour">
                        <td colspan="4">
                            Journée du ${dateActuelle}
                        </td>
                    </tr>
                `;
            }

            listeSeances.innerHTML += `
                <tr>

                    <td>
                        ${seance.heure_debut} - ${seance.heure_fin}
                    </td>

                    <td>
                        <span class="badge-type">
                            ${seance.type_seance}
                        </span>
                    </td>

                    <td class="titre-cours">
                        ${seance.titre}
                    </td>

                    <td>
                        ${seance.salle}
                    </td>

                </tr>
            `;
        });
    }

    const interrosSemaine = seancesDeLaSemaine.filter(seance => {

        const type = seance.type_seance
            ? seance.type_seance.toLowerCase()
            : "";

        const titre = seance.titre
            ? seance.titre.toLowerCase()
            : "";

        return type.includes("exam")
            || type.includes("contr")
            || type.includes("interro")
            || type.includes("eval")
            || titre.includes("exam")
            || titre.includes("contr")
            || titre.includes("interro")
            || titre.includes("eval");

    }).length;

    const notesPublieesSemaine = toutesLesNotes.filter(note => {

        const dateNote = new Date(note.date_creation);

        return dateNote >= lundi && dateNote <= dimanche;

    }).length;

    document.getElementById("nombreControles").textContent =
        Math.max(interrosSemaine, notesPublieesSemaine);
}

document.getElementById("semainePrecedente")
    .addEventListener("click", () => {

        datePivot.setDate(datePivot.getDate() - 7);

        actualiserSemaineDynamique();
});

document.getElementById("semaineSuivante")
    .addEventListener("click", () => {

        datePivot.setDate(datePivot.getDate() + 7);

        actualiserSemaineDynamique();
});


const messageZone = document.getElementById("messageAppel");

const inputToken = document.getElementById("codePresence");

const lecteurQR = document.getElementById("lecteur-qr");

async function validerTokenServeur(token) {

    const formData = new FormData();

    formData.append("token", token);

    formData.append("id_utilisateur", utilisateur.id);

    try {

        const reponse = await fetch(
            "../../../backend/Etudiant/validerPresenceQR.php",
            {
                method: "POST",
                body: formData
            }
        );

        const resultat = await reponse.json();

        if (resultat.success) {

            appliquerMessage(
                "success",
                "✅ " + resultat.message
            );

            inputToken.value = "";

        } else {

            appliquerMessage(
                "error",
                "❌ " + resultat.message
            );
        }

    } catch (e) {

        appliquerMessage(
            "error",
            "❌ Erreur de communication avec le serveur."
        );
    }
}

const btnValiderPresence =
    document.getElementById("btnValiderPresence");

if (btnValiderPresence) {

    btnValiderPresence.addEventListener("click", () => {

        const token = inputToken.value.trim();

        if (!token) {

            appliquerMessage(
                "warning",
                "⚠️ Veuillez entrer un code."
            );

            return;
        }

        validerTokenServeur(token);
    });
}

const btnScanner = document.getElementById("btnScanner");

if (btnScanner) {

    btnScanner.addEventListener("click", () => {

        lecteurQR.classList.add("lecteur-visible");

        messageZone.textContent = "";

        const html5QrcodeScanner =
            new Html5QrcodeScanner(
                "lecteur-qr",
                {
                    fps: 10,
                    qrbox: 250
                }
            );

        html5QrcodeScanner.render(

            (texteDecode) => {

                html5QrcodeScanner.clear();

                lecteurQR.classList.remove("lecteur-visible");

                appliquerMessage(
                    "info",
                    "⏳ Vérification en cours..."
                );

                validerTokenServeur(texteDecode);
            },

            (erreur) => {}
        );
    });
}


});
