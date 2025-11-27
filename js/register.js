// ===============================
// REGISTER PAGE SCRIPT
// ===============================

const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value.trim();
    const confirmPassword = document.getElementById("regConfirmPassword").value.trim();

    if (!name || !email || !password || !confirmPassword) {
        alert("Please fill in all fields.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    // Fetch users from localStorage
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if email already exists
    if (users.some(u => u.email === email)) {
        alert("Email already registered.");
        return;
    }

    const newUser = {
        id: Date.now().toString(),
        name: name,
        email: email,
        password: password
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("loggedInUser", JSON.stringify(newUser));

    alert("Account created successfully!");
    window.location.href = "index.html";
});
