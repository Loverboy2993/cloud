let clientData = {};

    // Function to load and parse the tab-delimited file
    function loadTabDelimited() {
        fetch('clients.txt') // Ensure this matches your actual tab-delimited file path
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch the file: ${response.statusText}`);
                }
                return response.text();
            })
            .then(data => {
                // Parse the tab-delimited file with PapaParse, specifying the tab delimiter
                const parsedData = Papa.parse(data, {
                    header: true,
                    delimiter: "\t", // Tab character as the delimiter
                    skipEmptyLines: true
                });

                // Populate clientData object
                parsedData.data.forEach(client => {
                    clientData[client.C_LAN_IP] = {
                        name: `${client.F_name} ${client.M_name} ${client.L_name}`,
                        address: client.C_add,
                        plan: client.C_plan,
                        speed: client.C_plan_spd,
                        isPaid: client.C_is_paid, // Ensure this value is "no" or "yes"
                        dueDate: client.C_due_date
                    };
                });

                // Call the function to display client details
                getClientDetails();
            })
            .catch(error => {
                console.error("Error fetching or parsing the file:", error);
            });
    }

    // Function to display client details
    function getClientDetails() {
        var clientIP = "192.168.100.4"; // Replace with a known IP from your tab-delimited file
        const today = new Date();
        const day = today.getDate(); // Get the current day (1-31)
        console.log("Today's Date:", day); // Debugging the current day

        if (clientData[clientIP]) {
            const client = clientData[clientIP];
            console.log("Client Data:", client); // Debugging client data

            // Fill in the client details on the page
            document.getElementById('client-name').innerText = client.name;
            document.getElementById('client-address').innerText = client.address;
            document.getElementById('client-plan').innerText = client.plan;
            document.getElementById('client-speed').innerText = client.speed;

            const paymentStatusElement = document.getElementById('payment-status');
            const dueDateElement = document.getElementById('due-date');
            const noticeElement = document.getElementById('payment-notice');
	    const payButton = document.querySelector('button'); // Reference to the pay button
            const reminderElement = document.getElementById('billing-reminder');

            // Check payment status
            if (client.isPaid === "no") {
                console.log("Client is unpaid"); // Debugging payment status
                paymentStatusElement.innerText = "Unpaid";
                paymentStatusElement.classList.add('unpaid');

                // Check if today is the 1st day of the month and onward
                if (day >= 1) {
                    console.log("Today is the 1st day of the month"); // Debugging date check
                    // Show the Pay button and the due date if unpaid
                    payButton.style.display = 'inline-block';
                    dueDateElement.innerText = `Due Date: ${client.dueDate}`;
                    noticeElement.innerText = "Please pay your bill as soon as possible to avoid disconnection."; // Show the payment notice
		    reminderElement.style.display = 'none'; // Hide billing reminder
                } else {
                    // Hide the Pay button and show the billing cycle reminder
                    console.log("Not the 1st day, hide Pay button");
                    payButton.style.display = 'none';
                    dueDateElement.innerText = ""; // Clear the due date
                    reminderElement.style.display = 'block'; // Show billing reminder
                    reminderElement.innerText = "Reminder: Your billing cycle is every end of the month.";
                }
            } else {
                console.log("Client is paid"); // Debugging payment status
                paymentStatusElement.innerText = "Paid";
                paymentStatusElement.classList.add('paid');
                payButton.style.display = 'none'; // Hide Pay button if client is paid
                dueDateElement.innerText = ""; // Clear the due date
                noticeElement.innerText = ""; // Clear the notice if the client is paid
	  	reminderElement.style.display = 'block'; // Show billing reminder
                reminderElement.innerText = "Reminder: Your billing cycle is every end of the month.";
            }
        } else {
            console.error("Client details not found for IP:", clientIP);
            document.getElementById('client-details').innerText = "Client details not found!";
        }
    }

    // Load the tab-delimited file on page load
    window.onload = loadTabDelimited;