// ===============================
// PRODUCTS PAGE SCRIPT
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    const productsContainer = document.querySelector(".products-container");
    const productGrid = document.querySelector(".product-grid");
    const container = productsContainer || productGrid;

    if (!container) {
        console.error("Products container not found");
        return;
    }

    let allProducts = [];

    // -------------------------
    // Helper: Get Cart from localStorage
    // -------------------------
    function getCart() {
        try {
            const cartData = localStorage.getItem("cart");
            return cartData ? JSON.parse(cartData) : [];
        } catch (error) {
            console.error("Error reading cart:", error);
            return [];
        }
    }

    // -------------------------
    // Helper: Save Cart to localStorage
    // -------------------------
    function saveCart(cart) {
        try {
            localStorage.setItem("cart", JSON.stringify(cart));
            return true;
        } catch (error) {
            console.error("Error saving cart:", error);
            alert("Unable to save to cart. Storage may be disabled.");
            return false;
        }
    }

    // -------------------------
    // Load products from JSON
    // -------------------------
    async function loadProducts() {
        try {
            const response = await fetch("data/products.json");
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const products = await response.json();
            allProducts = products;
            
            // Check for category filter from URL
            const urlParams = new URLSearchParams(window.location.search);
            const categoryParam = urlParams.get('category');
            
            if (categoryParam) {
                // Apply category filter if present
                const categoryFilter = document.getElementById("categoryFilter");
                if (categoryFilter) {
                    categoryFilter.value = categoryParam;
                }
                const filtered = products.filter(p => p.category.toLowerCase() === categoryParam.toLowerCase());
                displayProducts(filtered);
            } else {
                displayProducts(products);
            }
            
        } catch (error) {
            console.error("Error loading products:", error);
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                    <p style="color: #ff4d4d; font-size: 18px;">
                        <i class="fa-solid fa-exclamation-triangle"></i> 
                        Unable to load products.
                    </p>
                    <p style="margin-top: 10px;">Please make sure <code>data/products.json</code> exists.</p>
                </div>
            `;
        }
    }

    // -------------------------
    // Display Products
    // -------------------------
    function displayProducts(products) {
        container.innerHTML = "";

        if (products.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                    <p style="font-size: 18px; color: #666;">
                        <i class="fa-solid fa-box-open"></i> 
                        No products found.
                    </p>
                </div>
            `;
            return;
        }

        products.forEach(product => {
            const productDiv = document.createElement("div");
            productDiv.classList.add("product-card");
            productDiv.dataset.id = product.id;

            productDiv.innerHTML = `
                <img src="${product.image}" alt="${product.name}" onerror="this.src='images/default-product.jpg'">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="price">$${parseFloat(product.price).toFixed(2)}</p>
                    <button class="add-cart-btn" data-product-id="${product.id}">
                        <i class="fa-solid fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            `;

            container.appendChild(productDiv);

            // Add to Cart button event
            const addBtn = productDiv.querySelector(".add-cart-btn");
            addBtn.addEventListener("click", (e) => {
                e.preventDefault();
                addToCart(product);
            });
        });
    }

    // -------------------------
    // Add to Cart Function
    // -------------------------
    function addToCart(product) {
        let cart = getCart();

        const existing = cart.find(item => item.id === product.id);

        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: parseFloat(product.price),
                image: product.image,
                quantity: 1
            });
        }

        if (saveCart(cart)) {
            // Show success message
            showNotification(`${product.name} added to cart!`);
            
            // Trigger storage event to update cart count
            window.dispatchEvent(new Event('storage'));
        }
    }

    // -------------------------
    // Show Notification
    // -------------------------
    function showNotification(message) {
        // Remove existing notification if any
        const existing = document.querySelector('.cart-notification');
        if (existing) {
            existing.remove();
        }

        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <i class="fa-solid fa-check-circle"></i> ${message}
        `;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: #00aaff;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            font-weight: 500;
        `;

        document.body.appendChild(notification);

        // Add CSS animation
        if (!document.querySelector('#notificationStyle')) {
            const style = document.createElement('style');
            style.id = 'notificationStyle';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(400px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(400px); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
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
        const category = categoryFilter ? categoryFilter.value : "all";
        if (category !== "all") {
            filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
        }

        // Filter by price
        const priceRange = priceFilter ? priceFilter.value : "all";
        if (priceRange !== "all") {
            const [min, max] = priceRange.split("-").map(Number);
            filtered = filtered.filter(p => p.price >= min && p.price <= max);
        }

        displayProducts(filtered);
    }

    // -------------------------
    // Start Loading Products
    // -------------------------
    loadProducts();
});