document.getElementById('predictionForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const formObject = Object.fromEntries(formData.entries());

    // Create a JSON object with the correct format
    const requestBody = {
        gender: formObject.gender,
        age: parseFloat(formObject.age),
        hypertension: parseInt(formObject.hypertension),
        heart_disease: parseInt(formObject.heart_disease),
        ever_married: formObject.ever_married,
        work_type: formObject.work_type,
        Residence_type: formObject.Residence_type,
        avg_glucose_level: parseFloat(formObject.avg_glucose_level),
        bmi: parseFloat(formObject.bmi),
        smoking_status: formObject.smoking_status
    };

    try {
        const response = await fetch('http://127.0.0.1:8000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const predictionText = `Prediction: ${result.prediction === 1 ? 'High risk of stroke' : 'Low risk of stroke'}`;

        // Create and display the overlay
        const overlay = document.createElement('div');
        overlay.classList.add('popup-overlay');
        document.body.appendChild(overlay);

        // Create and display the pop-up card
        const popupCard = document.createElement('div');
        popupCard.classList.add('popup-card');
        popupCard.innerHTML = `
            <div class="popup-content">
                <span class="close-button">&times;</span>
                <p>${predictionText}</p>
            </div>
        `;
        document.body.appendChild(popupCard);

        // Close the pop-up card and overlay when the close button is clicked
        popupCard.querySelector('.close-button').addEventListener('click', function() {
            document.body.removeChild(popupCard);
            document.body.removeChild(overlay);
        });

        // Close the pop-up card and overlay when clicking outside of the card
        overlay.addEventListener('click', function() {
            document.body.removeChild(popupCard);
            document.body.removeChild(overlay);
        });
    } catch (error) {
        console.error('Error:', error);

        // Create and display the overlay
        const overlay = document.createElement('div');
        overlay.classList.add('popup-overlay');
        document.body.appendChild(overlay);

        const errorPopupCard = document.createElement('div');
        errorPopupCard.classList.add('popup-card');
        errorPopupCard.innerHTML = `
            <div class="popup-content">
                <span class="close-button">&times;</span>
                <p>Error making prediction.</p>
            </div>
        `;
        document.body.appendChild(errorPopupCard);

        // Close the error pop-up card and overlay when the close button is clicked
        errorPopupCard.querySelector('.close-button').addEventListener('click', function() {
            document.body.removeChild(errorPopupCard);
            document.body.removeChild(overlay);
        });

        // Close the error pop-up card and overlay when clicking outside of the card
        overlay.addEventListener('click', function() {
            document.body.removeChild(errorPopupCard);
            document.body.removeChild(overlay);
        });
    }
});
