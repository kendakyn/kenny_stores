// ===============================
// LOGIN PAGE SCRIPT
// ===============================

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!email || !password) {
        alert("Please fill in all fields.");
        return;
    }

    // Fetch users from localStorage (replace with backend API later)
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        alert("Login successful!");
        window.location.href = "index.html";
    } else {
        alert("Invalid email or password.");
    }
});
