document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;
    const message = document.getElementById("loginMessage");

    message.textContent = "";
    message.style.color = "red";

    // Get registered accounts
    const users = JSON.parse(localStorage.getItem("findbackUsers")) || [];

    // Find an account matching the email and password
    const user = users.find(function(account) {
        return account.email === email && account.password === password;
    });

    if (!user) {
        message.textContent = "Account not found or incorrect password. Please sign up or try again.";
        return;
    }

    // Remember the logged-in user for the home page
    localStorage.setItem("findbackLoggedIn", "true");
    localStorage.setItem("findbackUserName", user.name);
    localStorage.setItem("findbackUserEmail", user.email);

    message.style.color = "green";
    message.textContent = "Login successful!";

    window.location.href = "land.html";
});
a