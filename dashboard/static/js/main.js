document.addEventListener("DOMContentLoaded", function() {
    // Formular absenden
    const careerForm = document.getElementById('careerForm');
    if (careerForm) {
        careerForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Berufserfahrung hinzufügen - einziger Event-Listener
    const addExperienceButton = document.getElementById('addExperience');
    if (addExperienceButton) {
        addExperienceButton.addEventListener('click', addExperienceField);
    }
    
    // Delegierter Event-Listener für das Entfernen von Erfahrungseinträgen
    const experiencesContainer = document.getElementById('experiences');
    if (experiencesContainer) {
        experiencesContainer.addEventListener('click', function(event) {
            if (event.target && (event.target.classList.contains('remove-experience') || 
                               event.target.classList.contains('removeExperience'))) {
                const experienceEntry = event.target.closest('.experience-entry');
                if (experienceEntry) {
                    experienceEntry.remove();
                }
            }
        });
    }

    // Dynamisch weitere Ausbildungseinträge hinzufügen
    const addEducationButton = document.getElementById('addEducation');
    const educationFieldsContainer = document.getElementById('educationFields');

    addEducationButton.addEventListener('click', function () {
        const educationEntry = document.createElement('div');
        educationEntry.classList.add('education-entry');
        
        const schoolInput = document.createElement('input');
        schoolInput.setAttribute('type', 'text');
        schoolInput.setAttribute('placeholder', 'Schule');
        
        const degreeInput = document.createElement('input');
        degreeInput.setAttribute('type', 'text');
        degreeInput.setAttribute('placeholder', 'Abschluss');
        
        const removeButton = document.createElement('button');
        removeButton.classList.add('remove-education');
        removeButton.textContent = 'Delete';
        
        educationEntry.appendChild(schoolInput);
        educationEntry.appendChild(degreeInput);
        educationEntry.appendChild(removeButton);
        
        educationFieldsContainer.appendChild(educationEntry);

        removeButton.addEventListener('click', function () {
            educationFieldsContainer.removeChild(educationEntry);
        });
    });

    // Kontakt-Slide öffnen
    function openContactSlide() {
        document.getElementById('contactSlide').classList.add('show');
    }

    // Kontakt-Slide schließen
    document.getElementById('closeSlide').addEventListener('click', function() {
        document.getElementById('contactSlide').classList.remove('show');
    });

    // Optional: Automatisch die Kontakt-Slide nach einer bestimmten Zeit anzeigen (z.B. nach 5 Sekunden)
    setTimeout(openContactSlide, 5000); // 5 Sekunden warten, bevor die Slide erscheint
});

// Erfahrungsfeld hinzufügen
function addExperienceField() {
    const experiences = document.getElementById('experiences');
    
    const newExperience = document.createElement('div');
    newExperience.className = 'experience-entry';
    newExperience.innerHTML = `
        <input type="text" placeholder="Firma">
        <input type="text" placeholder="Position">
        <input type="date" placeholder="Start-Datum">
        <input type="date" placeholder="End-Datum">
        <button type="button" class="remove-experience">Entfernen</button>
    `;
    
    experiences.appendChild(newExperience);
    
    // Leichte Animation für den neuen Eintrag
    setTimeout(() => {
        newExperience.style.opacity = '0';
        newExperience.style.transition = 'opacity 0.3s ease';
        
        requestAnimationFrame(() => {
            newExperience.style.opacity = '1';
        });
    }, 0);
    
    // Scrollen zum neuen Eintrag
    newExperience.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Formulardaten sammeln und senden
async function handleFormSubmit(event) {
    event.preventDefault();
    
    // Manuelle Validierung
    const experienceEntries = document.querySelectorAll('#experiences .experience-entry');
    let isFormValid = true;
    
    experienceEntries.forEach(entry => {
        const company = entry.querySelector('input[placeholder="Firma"]').value;
        const position = entry.querySelector('input[placeholder="Position"]').value;
        const startDate = entry.querySelector('input[placeholder="Start-Datum"]').value;
        
        if (!company || !position || !startDate) {
            isFormValid = false;
            // Fügen Sie hier keine sichtbaren Fehlermeldungen hinzu, nur die Validierung
            entry.querySelectorAll('input').forEach(input => {
                if (!input.value && (input !== entry.querySelector('input[placeholder="End-Datum"]'))) {
                    input.style.borderColor = '#FF5F00';
                } else {
                    input.style.borderColor = '#ddd';
                }
            });
        }
    });
    
    if (!isFormValid) {
        return; // Verhindert das Absenden, wenn nicht alle Pflichtfelder ausgefüllt sind
    }
    
    // Loader anzeigen, Ergebnisse ausblenden
    const loader = document.getElementById('loader-prediction');
    const loaderContainer = document.querySelector('.loader-container-prediction');
    const resultDiv = document.getElementById('predictionResult');
    
    loader.style.display = 'block';
    loaderContainer.style.display = 'flex';
    resultDiv.style.display = 'none';
    
    // Berufserfahrungen sammeln
    const experiences = Array.from(experienceEntries).map(entry => {
        const company = entry.querySelector('input[placeholder="Firma"]').value || '';
        const position = entry.querySelector('input[placeholder="Position"]').value || '';
        const startDate = entry.querySelector('input[placeholder="Start-Datum"]').value || '';
        const endDate = entry.querySelector('input[placeholder="End-Datum"]').value || '';
        return { company, position, startDate, endDate };
    });
    
    // Modell auswählen
    const modelType = document.getElementById('modelType').value;
    
    // Daten für API-Anfrage vorbereiten
    const formData = {
        experiences,
        modelType
    };
    
    try {
        // API-Anfrage senden
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        // Ergebnisse anzeigen
        displayPrediction(data);
    } catch (error) {
        console.error('Fehler bei der Vorhersage:', error);
        // Fehlermeldung anzeigen
        document.getElementById('recommendation-list').innerHTML = 
            `<li class="recommendation-item" style="color: #dc3545">Fehler bei der Vorhersage: ${error.message}</li>`;
    } finally {
        // Loader ausblenden, Ergebnisse anzeigen
        loader.style.display = 'none';
        loaderContainer.style.display = 'none';
        resultDiv.style.display = 'block';
    }
}

// Vorhersage anzeigen
function displayPrediction(data) {
    const resultDiv = document.getElementById('predictionResult');
    const probabilityValue = document.getElementById('probability-value');
    const probabilityBar = document.getElementById('probability-bar');
    const recommendationList = document.getElementById('recommendation-list');
    
    // Sicherstellen, dass die Daten vorhanden sind
    if (!data || !data.confidence) {
        recommendationList.innerHTML = '<li class="recommendation-item">Keine Vorhersage verfügbar</li>';
        return;
    }
    
    // Wahrscheinlichkeit als Prozent (erster Wert im Array oder direkter Wert)
    const confidence = Array.isArray(data.confidence) ? data.confidence[0] * 100 : data.confidence * 100;
    
    // Wahrscheinlichkeitswert und Balken einstellen
    probabilityValue.textContent = `${confidence.toFixed(0)}%`;
    probabilityBar.style.width = `${confidence}%`;
    
    // Klasse basierend auf Wahrscheinlichkeitswert setzen
    if (confidence < 30) {
        probabilityBar.className = 'probability-bar-single probability-low-single';
    } else if (confidence < 70) {
        probabilityBar.className = 'probability-bar-single probability-medium-single';
    } else {
        probabilityBar.className = 'probability-bar-single probability-high-single';
    }
    
    // Empfehlungen anzeigen - sicherstellen, dass recommendations ein Array ist
    recommendationList.innerHTML = '';
    
    // Prüfen ob recommendations vorhanden ist
    if (!data.recommendations) {
        recommendationList.innerHTML = '<li class="recommendation-item">Keine Empfehlungen verfügbar</li>';
        return;
    }
    
    // Recommendations in ein Array umwandeln, falls es keins ist
    const recommendations = Array.isArray(data.recommendations) 
        ? data.recommendations 
        : [data.recommendations];
    
    // Recommendations anzeigen
    recommendations.forEach(recommendation => {
        const listItem = document.createElement('li');
        listItem.className = 'recommendation-item';
        listItem.textContent = recommendation;
        recommendationList.appendChild(listItem);
    });
    
    // Ergebnisbereich anzeigen
    resultDiv.style.display = 'block';
    
    // Zu den Ergebnissen scrollen
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}
