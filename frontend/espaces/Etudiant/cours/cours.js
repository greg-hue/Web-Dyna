document.addEventListener("DOMContentLoaded", async () => { 
    
    const utilisateur = JSON.parse(
        localStorage.getItem("utilisateurConnecte")
    ); 
    
    if (!utilisateur || utilisateur.role !== "etudiant") { 
        window.location.href = "../../../authentification.html"; 
        return; 
    } 
    
    document.getElementById("nomUtilisateur").textContent = 
        utilisateur.prenom + " " + utilisateur.nom; 
        
    document.getElementById("roleUtilisateur").textContent = 
        "Étudiant"; 
        
    document.getElementById("btnDeconnexion") 
        .addEventListener("click", () => { 
            localStorage.removeItem("utilisateurConnecte"); 
            
            window.location.href = 
                "../../../authentification.html"; 
        
        }); 
    
    try { 
        
        const reponse = await fetch( 
            "../../../../backend/Etudiant/getEtudiantCours.php?id_utilisateur=" 
            + utilisateur.id 
        ); 
            
        const resultat = await reponse.json(); 
        
        const listeCours = document.getElementById("listeCours"); 
        
        if (resultat.success) { 
            resultat.cours.forEach(cours => { 
                listeCours.innerHTML += ` 
                    <tr> 
                        <td>${cours.code}</td> 
                        <td>${cours.titre}</td> 
                        <td>${cours.semestre}</td> 
                        <td>${cours.credits}</td> 
                        <td> ${cours.prenom} ${cours.nom} </td> 
                    </tr> 
                `; 
            }); 
        } 
    } catch (erreur) { 
        console.error(erreur); 
        alert("Erreur chargement cours"); 
    } 
});