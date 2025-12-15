// ===============================
// MAIN SITE SCRIPT - global functionality
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       CART COUNT IN HEADER
    ========================= */
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
    window.addEventListener("storage", updateCartCount);

    /* =========================
       LOAD PRODUCTS FROM BACKEND
    ========================= */
    const productGrid = document.getElementById("featured-products");

    if (productGrid) {
        fetch("http://localhost:3000/api/products")
            .then(res => res.json())
            .then(products => {
                productGrid.innerHTML = "";

                products.forEach(product => {
                    const card = document.createElement("div");
                    card.classList.add("product-card");

                    card.innerHTML = `
                        <img src="${product.image}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p class="price">$${product.price}</p>
                        <button class="add-cart-btn" data-id="${product._id}">
                            Add to Cart
                        </button>
                    `;

                    productGrid.appendChild(card);
                });

                attachAddToCartEvents();
            })
            .catch(err => console.error("Failed to load products:", err));
    }

    /* =========================
       ADD TO CART EVENTS
    ========================= */
    function attachAddToCartEvents() {
        const addCartButtons = document.querySelectorAll(".add-cart-btn");

        addCartButtons.forEach(button => {
            button.addEventListener("click", function (e) {
                e.preventDefault();

                const productCard = this.closest(".product-card");

                const product = {
                    id: this.dataset.id, // MongoDB _id
                    name: productCard.querySelector("h3").textContent,
                    price: parseFloat(
                        productCard.querySelector(".price").textContent.replace("$", "")
                    ),
                    image: productCard.querySelector("img").src,
                    quantity: 1
                };

                addToCart(product);
            });
        });
    }

    /* =========================
       ADD TO CART LOGIC
    ========================= */
    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        const existingProduct = cart.find(item => item.id === product.id);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push(product);
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        window.dispatchEvent(new Event("storage"));

        alert(`${product.name} added to cart!`);
    }

    /* =========================
       CHECK LOGGED-IN USER
    ========================= */
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (loggedInUser) {
        const loginLink = document.querySelector('.navbar a[href="login.html"]');
        if (loginLink) {
            loginLink.textContent = "Profile";
            loginLink.href = "profile.html";
        }
    }

    /* =========================
       RESPONSIVE MENU
    ========================= */
    const menuIcon = document.querySelector(".menu-icon");
    const navbar = document.querySelector(".navbar");

    if (menuIcon) {
        menuIcon.addEventListener("click", () => {
            navbar.classList.toggle("active");
        });
    }

    /* =========================
       CATEGORY NAVIGATION
    ========================= */
    const categoryCards = document.querySelectorAll(".category-card");

    categoryCards.forEach(card => {
        card.addEventListener("click", function () {
            const categoryName = this.querySelector("span").textContent;
            window.location.href = `products.html?category=${encodeURIComponent(categoryName)}`;
        });
    });

});
