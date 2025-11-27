// ===============================
// PRODUCTS PAGE SCRIPT
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    const productsContainer = document.querySelector(".products-container");

    if (!productsContainer) return;

    let allProducts = []; // store all products for filtering

    // -------------------------
    // Load products from JSON
    // -------------------------
    async function loadProducts() {
        try {
            const response = await fetch("data/products.json");
            const products = await response.json();
            allProducts = products; // save all products for filtering
            displayProducts(products);
        } catch (error) {
            console.error("Error loading products:", error);
            productsContainer.innerHTML = "<p>Unable to load products.</p>";
        }
    }

    // -------------------------
    // Display Products
    // -------------------------
    function displayProducts(products) {
        productsContainer.innerHTML = "";

        if (products.length === 0) {
            productsContainer.innerHTML = "<p>No products found.</p>";
            return;
        }

        products.forEach(product => {
            const productDiv = document.createElement("div");
            productDiv.classList.add("product-card");
            productDiv.dataset.id = product.id;

            productDiv.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="price">$${product.price.toFixed(2)}</p>
                    <button class="add-cart-btn">Add to Cart</button>
                    <a href="product-details.html?id=${product.id}" class="btn small-btn">View Details</a>
                </div>
            `;

            productsContainer.appendChild(productDiv);

            // Add to Cart button
            const addBtn = productDiv.querySelector(".add-cart-btn");
            addBtn.addEventListener("click", () => {
                addToCart(product);
            });
        });
    }

    // -------------------------
    // Add to Cart Function
    // -------------------------
    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        const existing = cart.find(item => item.id === product.id);

        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        alert(`Added ${product.name} to cart!`);
        window.dispatchEvent(new Event('storage'));
    }

    // -------------------------
    // FILTER LOGIC
    // -------------------------
    const categoryFilter = document.getElementById("categoryFilter");
    const priceFilter = document.getElementById("priceFilter");

    if (categoryFilter) categoryFilter.addEventListener("change", applyFilters);
    if (priceFilter) priceFilter.addEventListener("change", applyFilters);

    function applyFilters() {
        let filtered = allProducts;

        // Filter by category
        const category = categoryFilter.value;
        if (category !== "all") {
            filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
        }

        // Filter by price
        const priceRange = priceFilter.value;
        if (priceRange !== "all") {
            const [min, max] = priceRange.split("-").map(Number);
            filtered = filtered.filter(p => p.price >= min && p.price <= max);
        }

        displayProducts(filtered);
    }

    // Start
    loadProducts();
});
