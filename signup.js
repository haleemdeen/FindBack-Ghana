document.getElementById("signupForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("fullName").value.trim();
    const email = document.getElementById("signupEmail").value.trim().toLowerCase();
    const contact = document.getElementById("signupContact").value.trim();
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const message = document.getElementById("signupMessage");

    message.textContent = "";
    message.style.color = "red";

    if (password !== confirmPassword) {
        message.textContent = "Passwords do not match.";
        return;
    }

    // Get previously registered accounts
    const users = JSON.parse(localStorage.getItem("findbackUsers")) || [];

    // Check whether this email is already registered
    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
        message.textContent = "This email is already registered. Please log in.";
        return;
    }

    // Save the new account
    const newUser = {
        name: name,
        email: email,
        contact: contact,
        password: password
    };

    users.push(newUser);
    localStorage.setItem("findbackUsers", JSON.stringify(users));

    message.style.color = "green";
    message.textContent = "Account created successfully! Redirecting to login...";

    document.getElementById("signupForm").reset();

    setTimeout(function() {
        window.location.href = "login.html";
    }, 1500);
});