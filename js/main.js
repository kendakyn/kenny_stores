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
    
    if (cartIcon && cartIcon.parentElement) {
        cartIcon.parentElement.style.position = "relative";
        cartIcon.parentElement.appendChild(cartCountSpan);
    }

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
        cartCountSpan.style.minWidth = "18px";
        cartCountSpan.style.textAlign = "center";
    }

    updateCartCount();

    // Update cart count whenever cart changes
    window.addEventListener("storage", updateCartCount);

    // -------------------------
    //  Add to Cart Functionality for Homepage
    // -------------------------
    const addCartButtons = document.querySelectorAll(".add-cart-btn");
    
    addCartButtons.forEach((button, index) => {
        button.addEventListener("click", function(e) {
            e.preventDefault();
            
            const productCard = this.closest(".product-card");
            const productName = productCard.querySelector("h3").textContent;
            const priceText = productCard.querySelector(".price").textContent;
            const productPrice = parseFloat(priceText.replace("$", ""));
            const productImage = productCard.querySelector("img").src;
            
            // Create product object
            const product = {
                id: (index + 1).toString(),
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            };
            
            // Add to cart
            addToCart(product);
        });
    });

    // -------------------------
    //  Add to Cart Function
    // -------------------------
    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        
        // use loose equality to allow id types coming from different pages (string/number)
        const existingProduct = cart.find(item => item.id == product.id);
        
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push(product);
        }
        
        localStorage.setItem("cart", JSON.stringify(cart));
        
        // Update cart count and notify other listeners/pages
        updateCartCount();
        // trigger a storage-like event so other scripts (same-window listeners) can react
        window.dispatchEvent(new Event('storage'));
        
        // Show success message
        alert(`${product.name} added to cart!`);
    }

    // -------------------------
    //  Check Logged-in User
    // -------------------------
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || null;
    if (loggedInUser) {
        // Example: change login link to profile
        const loginLink = document.querySelector('.navbar a[href="login.html"]');
        if (loginLink) {
            loginLink.textContent = "Profile";
            loginLink.href = "profile.html";
        }
    }

    // -------------------------
    //  Optional: Responsive Menu Toggle
    // -------------------------
    const menuIcon = document.querySelector(".menu-icon");
    const navbar = document.querySelector(".navbar");

    if (menuIcon) {
        menuIcon.addEventListener("click", () => {
            navbar.classList.toggle("active");
        });
    }

    // -------------------------
    //  Category Card Click Handler
    // -------------------------
    const categoryCards = document.querySelectorAll(".category-card");
    
    categoryCards.forEach(card => {
        card.addEventListener("click", function() {
            const categoryName = this.querySelector("span").textContent;
            // Redirect to products page with category filter
            window.location.href = `products.html?category=${encodeURIComponent(categoryName)}`;
        });
    });

});