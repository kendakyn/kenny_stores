document.addEventListener("DOMContentLoaded", function () {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const cartItemsContainer = document.getElementById("cartItems");
    const cartContainer = document.getElementById("cartContainer");
    const emptyMessage = document.getElementById("emptyCartMessage");
    const totalBox = document.getElementById("cartTotalBox");
    const checkoutBtn = document.querySelector(".checkout-btn");

    // ===============================
    // SAVE CART
    // ===============================
    function saveCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    // ===============================
    // LOAD CART
    // ===============================
    function loadCart() {
        if (!cartItemsContainer) return;

        cartItemsContainer.innerHTML = "";

        if (cart.length === 0) {
            emptyMessage.style.display = "block";
            cartContainer.style.display = "none";
            totalBox.style.display = "none"; // hide checkout
            return;
        }

        emptyMessage.style.display = "none";
        cartContainer.style.display = "block";
        totalBox.style.display = "block"; // show checkout

        cart.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="product-info">
                    <img src="${item.image}" class="cart-img">
                    <span>${item.name}</span>
                </td>
                <td>$${item.price.toFixed(2)}</td>
                <td>
                    <select class="quantity-select" data-id="${item.id}">
                        ${[1,2,3,4,5].map(q => `<option value="${q}" ${item.quantity === q ? "selected" : ""}>${q}</option>`).join("")}
                    </select>
                </td>
                <td>$${(item.price * item.quantity).toFixed(2)}</td>
                <td>
                    <button class="remove-btn" data-id="${item.id}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            `;
            cartItemsContainer.appendChild(row);
        });

        updateCartTotal();
    }

    // ===============================
    // UPDATE TOTAL
    // ===============================
    function updateCartTotal() {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        document.getElementById("cartTotalAmount").textContent = "$" + total.toFixed(2);
    }

    // ===============================
    // CHANGE QUANTITY
    // ===============================
    document.addEventListener("change", function (e) {
        if (e.target.classList.contains("quantity-select")) {
            const id = e.target.getAttribute("data-id");
            const product = cart.find(item => item.id === id);
            if (product) {
                product.quantity = parseInt(e.target.value);
                saveCart();
                loadCart();
            }
        }
    });

    // ===============================
    // REMOVE ITEM
    // ===============================
    document.addEventListener("click", function (e) {
        if (e.target.closest(".remove-btn")) {
            const id = e.target.closest(".remove-btn").getAttribute("data-id");
            cart = cart.filter(item => item.id !== id);
            saveCart();
            loadCart();
        }
    });

    // ===============================
    // CHECKOUT BUTTON
    // ===============================
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            if (cart.length === 0) {
                alert("Your cart is empty!");
            } else {
                window.location.href = "checkout.html";
            }
        });
    }

    // ===============================
    // INITIAL LOAD
    // ===============================
    loadCart();

});
