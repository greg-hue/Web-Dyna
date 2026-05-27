document.addEventListener("DOMContentLoaded", async () => {

    const utilisateur = JSON.parse(localStorage.getItem("utilisateurConnecte"));

    if (!utilisateur || utilisateur.role !== "enseignant") {
        window.location.href = "../../../authentification.html";
        return;
    }

    document.getElementById("nomUtilisateur").textContent =
        utilisateur.prenom + " " + utilisateur.nom;

    document.getElementById("roleUtilisateur").textContent = "Professeur";

    document.getElementById("btnDeconnexion").addEventListener("click", () => {
        localStorage.removeItem("utilisateurConnecte");
        window.location.href = "../../../authentification.html";
    });

    const listeNotes = document.getElementById("listeNotes");
    const selectEtudiant = document.getElementById("etudiantId");
    const selectCours = document.getElementById("coursId");
    const messageNote = document.getElementById("messageNote");

    async function chargerNotes() {
        const reponse = await fetch(
            "../../../../backend/Prof/note/getProfNotes.php?id_utilisateur=" + utilisateur.id
        );

        const resultat = await reponse.json();

        listeNotes.innerHTML = "";
        selectEtudiant.innerHTML = `<option value="">Choisir un étudiant</option>`;
        selectCours.innerHTML = `<option value="">Choisir un cours</option>`;

        if (resultat.success) {
            resultat.etudiants.forEach(etudiant => {
                selectEtudiant.innerHTML += `
                    <option value="${etudiant.id_etudiant}">
                        ${etudiant.prenom} ${etudiant.nom} (${etudiant.groupe})
                    </option>
                `;
            });

            resultat.cours.forEach(cours => {
                selectCours.innerHTML += `
                    <option value="${cours.id_cours}">
                        ${cours.titre}
                    </option>
                `;
            });

            resultat.notes.forEach(note => {
                listeNotes.innerHTML += `
                    <tr>
                        <td>${note.prenom} ${note.nom} (${note.groupe})</td>
                        <td>${note.matiere}</td>
                        <td>${note.type_evaluation}</td>
                        <td>${note.note}/20</td>
                        <td>${note.coefficient}</td>
                        <td>
                            <button onclick="modifierNote(
                                ${note.id_note},
                                '${note.note}',
                                '${note.type_evaluation}',
                                '${note.coefficient}'
                            )">
                                Modifier
                            </button>
                        </td>
                    </tr>
                `;
            });
        }
    }

    document.getElementById("formAjoutNote").addEventListener("submit", async (event) => {
        event.preventDefault();

        const donnees = new FormData();
        donnees.append("etudiant_id", selectEtudiant.value);
        donnees.append("cours_id", selectCours.value);
        donnees.append("type_evaluation", document.getElementById("typeEvaluation").value);
        donnees.append("note", document.getElementById("note").value);
        donnees.append("coefficient", document.getElementById("coefficient").value);

        const reponse = await fetch("../../../../backend/Prof/note/addProfNote.php", {
            method: "POST",
            body: donnees
        });

        const resultat = await reponse.json();

        if (resultat.success) {
            messageNote.style.color = "green";
            messageNote.textContent = "Note ajoutée.";
            event.target.reset();
            chargerNotes();
        } else {
            messageNote.style.color = "red";
            messageNote.textContent = resultat.message;
        }
    });

    window.modifierNote = async function(idNote, noteActuelle, typeActuel, coefficientActuel) {
        const nouvelleNote = prompt("Nouvelle note :", noteActuelle);
        if (nouvelleNote === null) return;

        const nouveauType = prompt("Type d'évaluation :", typeActuel);
        if (nouveauType === null) return;

        const nouveauCoefficient = prompt("Coefficient :", coefficientActuel);
        if (nouveauCoefficient === null) return;

        const donnees = new FormData();
        donnees.append("id_note", idNote);
        donnees.append("note", nouvelleNote);
        donnees.append("type_evaluation", nouveauType);
        donnees.append("coefficient", nouveauCoefficient);

        const reponse = await fetch("../../../../backend/Prof/note/updateProfNote.php", {
            method: "POST",
            body: donnees
        });

        const resultat = await reponse.json();

        if (resultat.success) {
            messageNote.style.color = "green";
            messageNote.textContent = "Note modifiée.";
            chargerNotes();
        } else {
            messageNote.style.color = "red";
            messageNote.textContent = resultat.message;
        }
    };

    chargerNotes();
});