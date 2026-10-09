// FIND BACK GHANA - ADMIN LOGIN

const adminLoginForm = document.getElementById("adminLoginForm");

if (adminLoginForm) {

    adminLoginForm.addEventListener("submit", function(event) {

        // Stop the form from refreshing the page
        event.preventDefault();

        // Get the values entered by the admin
        const email = document.getElementById("adminEmail").value.trim();
        const password = document.getElementById("adminPassword").value;

        // Get the message area
        const loginMessage = document.getElementById("loginMessage");

        // DEMO ONLY: These credentials are visible in browser source
        const correctEmail = "admin@findbackghana.com";
        const correctPassword = "FindBackDemo2026!";

        // Check the entered credentials
        if (email === correctEmail && password === correctPassword) {

            // Record a temporary login state for this browser tab
            sessionStorage.setItem("findbackAdminLoggedIn", "true");

            // Send the admin to the existing dashboard
            window.location.href = "admin.html";

        } else {

            // Display an error message
            loginMessage.textContent =
                "Incorrect email or password. Please try again.";

        }

    });

}