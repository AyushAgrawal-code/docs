// Airtable API details
const BASE_ID = "app84WtVEH43pwD8F"; // Replace with your Airtable Base ID
const TABLE_NAME = "tblNgcEIQD5ld3J8e"; // Replace with your Table Name or friendly name
const API_KEY = "patyC5aCywOtdxtuB.d33fd5feb811bf1adcfabdcc12eb4d3f0008c04e3770509220e1775f44a898c9"; // Replace with your Airtable API Key

// Function to write form data to Airtable
async function writeToAirtable(name, email, message) {
    const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;
    const record = {
        records: [
            {
                fields: {
                    Name: name, // Name field in Airtable
                    email: email, // Email field in Airtable
                    question: message, // Message field in Airtable
                },
            },
        ],
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(record),
        });

        const responseBody = await response.json();

        if (response.ok) {
            alert("Your message has been successfully sent!");
            console.log("Data successfully written to Airtable:", responseBody);
        } else {
            alert("Error sending your message. Please try again.");
            console.error("Error writing to Airtable:", responseBody);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// Function to handle form submission
async function handleSubmit() {
    event.preventDefault();
    // Collect user input values
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    console.log(name);
    console.log(email)
    console.log(message)

    // Validate form inputs
    if (!name || !email || !message) {
        alert("Please fill out all fields.");
        return;
    }

    // Call function to save data to Airtable
    await writeToAirtable(name, email, message);

    // Clear the form after submission
    document.querySelector("form").reset();
}
