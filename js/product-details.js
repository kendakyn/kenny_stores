// ===============================
//  CONFIG
// ===============================
const SERVER_URL = "http://localhost:3000"; // Backend server URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

// Elements on Product Details Page
const productImage = document.getElementById("productImage");
const productName = document.getElementById("productName");
const productBrand = document.getElementById("productBrand");
const productPrice = document.getElementById("productPrice");
const productDescription = document.getElementById("productDescription");
const relatedProductsContainer = document.getElementById("relatedProducts");
const addToCartBtn = document.getElementById("addToCartBtn");

// Placeholder if product not found
if (!productId && document.querySelector(".product-detail-section")) {
    document.querySelector(".product-detail-section").innerHTML =
        "<h2 style='text-align:center;'>Product not found.</h2>";
}

// ===============================
//  LOAD PRODUCTS FROM BACKEND
// ===============================
async function loadProducts() {
    try {
        const response = await fetch(`${SERVER_URL}/api/products`);
        const products = await response.json();

        // For Product Details Page
        if (productId) {
            const product = products.find(p => p._id === productId);
            if (!product) {
                document.querySelector(".product-detail-section").innerHTML =
                    "<h2 style='text-align:center;'>Product not found.</h2>";
                return;
            }
            displayProduct(product);
            loadRelated(products, product.category);
        }

        // For Homepage Product Grid
        const grid = document.querySelector(".product-grid");
        if (grid) {
            grid.innerHTML = "";
            products.forEach(p => {
                const div = document.createElement("div");
                div.classList.add("product-card");
                div.dataset.id = p._id;
                div.dataset.category = p.category;
                div.dataset.price = p.price;

                div.innerHTML = `
                    <img src="${SERVER_URL + p.image}" alt="${p.name}">
                    <h3>${p.name}</h3>
                    <p class="price">$${p.price}</p>
                    <button class="add-cart-btn">Add to Cart</button>
                `;

                grid.appendChild(div);

                // Add click listener for Add to Cart
                const btn = div.querySelector(".add-cart-btn");
                btn.addEventListener("click", () => addToCart(p));
            });
        }

        // For Admin Page (if admin panel exists)
        const productsList = document.getElementById("productsList");
        if (productsList) {
            productsList.innerHTML = "";
            products.forEach(p => {
                const div = document.createElement("div");
                div.innerHTML = `
                    <img src="${SERVER_URL + p.image}" alt="${p.name}">
                    <strong>${p.name}</strong> - $${p.price} - ${p.category}
                    <button onclick="deleteProduct('${p._id}')">Delete</button>
                    <button onclick="editProduct('${p._id}')">Edit</button>
                `;
                productsList.appendChild(div);
            });
        }

    } catch (error) {
        console.error("Error loading products:", error);
    }
}

// ===============================
//  DISPLAY PRODUCT DETAILS
// ===============================
function displayProduct(product) {
    if (!productImage) return;

    productImage.src = SERVER_URL + product.image;
    productName.textContent = product.name;
    productBrand.textContent = product.brand ? `Brand: ${product.brand}` : "";
    productPrice.textContent = `$${product.price.toFixed(2)}`;
    productDescription.textContent = product.description;

    // Add to cart button
    const newBtn = addToCartBtn.cloneNode(true); // remove previous listeners
    addToCartBtn.parentNode.replaceChild(newBtn, addToCartBtn);
    newBtn.addEventListener("click", () => addToCart(product));
}

// ===============================
//  LOAD RELATED PRODUCTS
// ===============================
function loadRelated(products, category) {
    if (!relatedProductsContainer) return;

    const related = products.filter(p => p.category === category && p._id !== productId);
    if (related.length === 0) {
        relatedProductsContainer.innerHTML = "<p>No related products found.</p>";
        return;
    }

    relatedProductsContainer.innerHTML = "";
    related.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("related-item");

        div.innerHTML = `
            <img src="${SERVER_URL + item.image}" alt="${item.name}">
            <h4>${item.name}</h4>
            <p>$${item.price.toFixed(2)}</p>
            <a href="product-details.html?id=${item._id}" class="btn small-btn">View</a>
        `;
        relatedProductsContainer.appendChild(div);

        const btn = div.querySelector(".btn");
        btn.addEventListener("click", () => {
            window.location.href = `product-details.html?id=${item._id}`;
        });
    });
}

// ===============================
//  ADD TO CART FUNCTION
// ===============================
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(item => item._id === product._id);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            _id: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));
    alert(`Added ${product.name} to cart!`);
}

// ===============================
//  DELETE & EDIT FUNCTIONS FOR ADMIN
// ===============================
async function deleteProduct(id) {
    await fetch(`${SERVER_URL}/api/products/${id}`, { method: "DELETE" });
    loadProducts();
}

function editProduct(id) {
    const name = prompt("New Name:");
    const category = prompt("New Category (Laptops / Phones / Accessories / Televisions):");
    const price = prompt("New Price:");
    const image = prompt("New Image URL (optional, leave empty to keep current):");
    const description = prompt("New Description:");

    if (!name || !category || !price) return;

    fetch(`${SERVER_URL}/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name,
            category,
            price: Number(price),
            image: image ? image : undefined,
            description
        })
    }).then(loadProducts);
}

// ===============================
//  INITIAL LOAD
// ===============================
loadProducts();
