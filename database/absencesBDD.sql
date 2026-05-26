CREATE TABLE absencesBDD (
    id_absence INT AUTO_INCREMENT PRIMARY KEY,
    id_eleve INT NOT NULL,
    date_absence DATE NOT NULL,
    heure_debut TIME,
    heure_fin TIME,
    statut ENUM('present', 'absent', 'retard', 'justifie') DEFAULT 'present',
    motif VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_eleve) REFERENCES elevesBDD(id_eleve)
);