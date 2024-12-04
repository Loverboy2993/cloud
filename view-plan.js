function loadPlans() {
    fetch('plan/plans.txt') // Ensure this path is correct
        .then(response => {
            console.log("Response status:", response.status); // Log response status
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();  // Return the text content of the file
        })
        .then(data => {
            console.log("Raw data received from plans.txt:", data); // Log raw data

            // Parse the data using PapaParse
            let parsedData = Papa.parse(data, {
                header: true,
                delimiter: "\t",  // Use tab as the delimiter
                skipEmptyLines: true
            });

            console.log("Parsed data from plans.txt:", parsedData.data); // Log parsed data

            // Check if parsedData has valid data
            if (!parsedData || !parsedData.data || parsedData.data.length === 0) {
                throw new Error('No valid plan data found in the file');
            }

            // Reference to the plan carousel container
            const planContainer = document.querySelector('.plan-carousel');

            // Loop through each plan and dynamically create HTML content
            parsedData.data.forEach(plan => {
                let planCard = `
                    <div class="plan-card">
                        <div class="plan-details">
                            <img src='../images/plan/${plan.Image}' alt="${plan['Plan Name']} Image" class="plan-image">
                            <div>
                                <h2>${plan['Plan Name']}</h2>
                                <p>Internet speed up to ${plan.Speed} for only P${plan.Price}/month.</p>
                                <ul class="plan-inclusions">
                                    <li>1pc Wifi router (${plan['Wifi Router']})</li>
                                    <li>${plan['Power Adaptor']} pcs Power adaptor</li>
                                    <li>1pc ${plan.Mediacon}</li>
                                    <li>${plan['UTP Cable']}</li>
                                </ul>
                                <span class="plan-installation">Installation fee: P${plan['Installation Fee']}.00</span>
                            </div>
                        </div>
                    </div>
                `;
                planContainer.innerHTML += planCard;
            });
        })
        .catch(error => {
            console.error('Error loading plans:', error);
            alert('An error occurred while loading the plans. Please try again later.');
        });
}

// Call loadPlans when the window loads
window.onload = loadPlans;
