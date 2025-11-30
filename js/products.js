document.addEventListener("DOMContentLoaded", function () {

    const productsContainer = document.querySelector(".product-grid");
    const categoryFilter = document.getElementById("categoryFilter");
    const priceFilter = document.getElementById("priceFilter");

    // Convert HTML products into JS array for filtering
    let allProducts = Array.from(productsContainer.querySelectorAll(".product-card")).map(card => ({
        id: card.dataset.id,
        name: card.querySelector("h3").textContent,
        price: parseFloat(card.dataset.price),
        category: card.dataset.category,
        image: card.querySelector("img").src,
        element: card
    }));

    // Add click listeners to Add to Cart buttons
    allProducts.forEach(product => {
        const btn = product.element.querySelector(".add-cart-btn");
        btn.addEventListener("click", () => addToCart(product));
    });

    // Add to Cart function
    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existing = cart.find(item => item.id == product.id);

        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        alert(`Added ${product.name} to cart!`);
        console.log('[Cart] Updated', cart);
    }

    // Filter function
    function applyFilters() {
        const selectedCategory = categoryFilter.value;
        const selectedPrice = priceFilter.value;

        allProducts.forEach(product => {
            let show = true;

            // Category filter
            if (selectedCategory !== "all" && product.category !== selectedCategory) {
                show = false;
            }

            // Price filter
            if (selectedPrice !== "all") {
                const [min, max] = selectedPrice.split("-").map(Number);
                if (product.price < min || product.price > max) {
                    show = false;
                }
            }

            // Show/hide product
            product.element.style.display = show ? "block" : "none";
        });
    }

    // Event listeners for filters
    categoryFilter.addEventListener("change", applyFilters);
    priceFilter.addEventListener("change", applyFilters);

});
