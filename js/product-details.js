// ===============================
//  GET PRODUCT ID FROM URL
// ===============================
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

// Elements in the HTML
const productImage = document.getElementById("productImage");
const productName = document.getElementById("productName");
const productBrand = document.getElementById("productBrand");
const productPrice = document.getElementById("productPrice");
const productDescription = document.getElementById("productDescription");
const relatedProductsContainer = document.getElementById("relatedProducts");
const addToCartBtn = document.getElementById("addToCartBtn");

// Placeholder if product not found
if (!productId) {
    document.querySelector(".product-detail-section").innerHTML =
        "<h2 style='text-align:center;'>Product not found.</h2>";
}



// ===============================
//  LOAD PRODUCT DATA (LOCAL JSON)
//  Replace with MongoDB API later
// ===============================
async function loadProducts() {
    try {
        const response = await fetch("data/products.json");
        const products = await response.json();

        const product = products.find(p => p.id == productId);

        if (!product) {
            document.querySelector(".product-detail-section").innerHTML =
                "<h2 style='text-align:center;'>Product not found.</h2>";
            return;
        }

        displayProduct(product);
        loadRelated(products, product.category);

    } catch (error) {
        console.error("Error loading product:", error);
    }
}



// ===============================
//  DISPLAY PRODUCT DETAILS
// ===============================
function displayProduct(product) {
    productImage.src = product.image;
    productName.textContent = product.name;
    productBrand.textContent = "Brand: " + product.brand;
    productPrice.textContent = product.price.toFixed(2);
    productDescription.textContent = product.description;

    // Add to cart button
    addToCartBtn.addEventListener("click", () => {
        addToCart(product);
    });
}



// ===============================
//  LOAD RELATED PRODUCTS
// ===============================
function loadRelated(products, category) {
    const related = products.filter(
        p => p.category === category && p.id != productId
    );

    if (related.length === 0) {
        relatedProductsContainer.innerHTML =
            "<p>No related products found.</p>";
        return;
    }

    relatedProductsContainer.innerHTML = "";

    related.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("related-item");

        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h4>${item.name}</h4>
            <p>$${item.price.toFixed(2)}</p>
            <a href="product-details.html?id=${item.id}" class="btn small-btn">View</a>
        `;

        relatedProductsContainer.appendChild(div);
    });
}



// ===============================
//  ADD TO CART FUNCTION
//  Works with cart.js system
// ===============================
function addToCart(product) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const exists = cart.find(item => item.id == product.id);

    if (exists) {
        exists.quantity += 1;
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

    alert("Product added to cart!");
}



// Start
loadProducts();
