// ===============================
// MAIN SITE SCRIPT - global functionality
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    // -------------------------
    //  Update Cart Count in Header
    // -------------------------
    const cartIcon = document.querySelector(".fa-cart-shopping");
    const cartCountSpan = document.createElement("span");
    cartCountSpan.classList.add("cart-count");
    cartIcon.parentElement.appendChild(cartCountSpan);

    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
        cartCountSpan.textContent = totalCount;
        cartCountSpan.style.backgroundColor = "#ff6600";
        cartCountSpan.style.color = "#fff";
        cartCountSpan.style.padding = "2px 6px";
        cartCountSpan.style.borderRadius = "50%";
        cartCountSpan.style.fontSize = "0.8rem";
        cartCountSpan.style.position = "absolute";
        cartCountSpan.style.top = "-8px";
        cartCountSpan.style.right = "-8px";
    }

    updateCartCount();

    // Update cart count whenever cart changes (optional: could be triggered from add-to-cart buttons)
    window.addEventListener("storage", updateCartCount);

    // -------------------------
    //  Check Logged-in User
    // -------------------------
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || null;
    if (loggedInUser) {
        // Example: change login link to profile
        const loginLink = document.querySelector('.navbar a[href="login.html"]');
        if (loginLink) {
            loginLink.textContent = "Profile";
            loginLink.href = "profile.html"; // link to profile page
        }
    }

    // -------------------------
    //  Optional: Responsive Menu Toggle
    // -------------------------
    const menuIcon = document.querySelector(".menu-icon"); // if you add a hamburger
    const navbar = document.querySelector(".navbar");

    if (menuIcon) {
        menuIcon.addEventListener("click", () => {
            navbar.classList.toggle("active");
        });
    }

});
