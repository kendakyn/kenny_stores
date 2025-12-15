// ===============================
// CHECKOUT PAGE SCRIPT - DEBUG VERSION
// ===============================

document.addEventListener("DOMContentLoaded", function () {
    console.log("Checkout page loaded");

    // ===============================
    // GET CART FROM LOCALSTORAGE
    // ===============================
    function getCart() {
        try {
            const cartData = localStorage.getItem("cart");
            return cartData ? JSON.parse(cartData) : [];
        } catch (error) {
            console.error("Error reading cart:", error);
            return [];
        }
    }

    // ===============================
    // INITIALIZE
    // ===============================
    const cart = getCart();
    const SHIPPING_COST = 10.00;

    console.log("Cart items:", cart);

    const orderItemsContainer = document.getElementById("orderItems");
    const subtotalElement = document.getElementById("subtotalAmount");
    const shippingElement = document.getElementById("shippingAmount");
    const totalElement = document.getElementById("checkoutTotal");
    const placeOrderBtn = document.getElementById("placeOrderBtn");
    const emptyCheckout = document.getElementById("emptyCheckout");
    const checkoutForm = document.getElementById("checkoutForm");
    const orderSummary = document.getElementById("orderSummary");

    // ===============================
    // LOAD ORDER SUMMARY
    // ===============================
    function loadOrderSummary() {
        if (cart.length === 0) {
            emptyCheckout.style.display = "block";
            checkoutForm.style.display = "none";
            orderSummary.style.display = "none";
            return;
        }

        emptyCheckout.style.display = "none";
        checkoutForm.style.display = "block";
        orderSummary.style.display = "block";

        orderItemsContainer.innerHTML = "";

        let subtotal = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            const orderItem = document.createElement("div");
            orderItem.className = "order-item";
            orderItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" onerror="this.src='images/default-product.jpg'">
                <div class="order-item-info">
                    <h4>${item.name}</h4>
                    <p>Quantity: ${item.quantity} × $${item.price.toFixed(2)}</p>
                </div>
                <div style="font-weight: 600; color: #00aaff;">
                    $${itemTotal.toFixed(2)}
                </div>
            `;
            orderItemsContainer.appendChild(orderItem);
        });

        const grandTotal = subtotal + SHIPPING_COST;

        subtotalElement.textContent = "$" + subtotal.toFixed(2);
        shippingElement.textContent = "$" + SHIPPING_COST.toFixed(2);
        totalElement.textContent = "$" + grandTotal.toFixed(2);

        console.log("Order loaded - Subtotal:", subtotal, "Total:", grandTotal);
    }

    // ===============================
    // PAYMENT METHOD SELECTION
    // ===============================
    const paymentOptions = document.querySelectorAll(".payment-option");
    
    paymentOptions.forEach(option => {
        option.addEventListener("click", function() {
            paymentOptions.forEach(opt => opt.classList.remove("selected"));
            this.classList.add("selected");
            
            const radio = this.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                console.log("Payment method selected:", radio.value);
            }
        });
    });

    // ===============================
    // PLACE ORDER BUTTON
    // ===============================
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener("click", function(e) {
            e.preventDefault();
            console.log("Place Order clicked");
            
            if (cart.length === 0) {
                alert("Your cart is empty!");
                return;
            }

            // Get form data
            const form = document.getElementById("shippingForm");
            
            // Validate form
            if (!form.checkValidity()) {
                form.reportValidity();
                console.log("Form validation failed");
                return;
            }

            console.log("Form is valid");

            // Get form values
            const formData = {
                firstName: document.getElementById("firstName").value,
                lastName: document.getElementById("lastName").value,
                email: document.getElementById("email").value,
                phone: document.getElementById("phone").value,
                address: document.getElementById("address").value,
                city: document.getElementById("city").value,
                state: document.getElementById("state").value,
                zipCode: document.getElementById("zipCode").value,
                country: document.getElementById("country").value,
                orderNotes: document.getElementById("orderNotes").value
            };

            console.log("Form data:", formData);

            // Get selected payment method
            const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked');
            const paymentMethod = selectedPayment ? selectedPayment.value : "card";

            console.log("Selected payment method:", paymentMethod);

            // Calculate totals
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const total = subtotal + SHIPPING_COST;

            // Create order object
            const order = {
                orderId: "ORD" + Date.now(),
                date: new Date().toISOString(),
                customer: formData,
                items: cart,
                subtotal: subtotal,
                shipping: SHIPPING_COST,
                total: total,
                paymentMethod: paymentMethod,
                status: "pending"
            };

            console.log("Order created:", order);

            // Save order data temporarily for payment processing
            try {
                localStorage.setItem("pendingOrder", JSON.stringify(order));
                console.log("Order saved to localStorage");
            } catch (error) {
                console.error("Error saving order:", error);
            }

            // Check if M-Pesa is selected - redirect to M-Pesa payment page
            if (paymentMethod === "mpesa") {
                console.log("Redirecting to M-Pesa page...");
                alert("Redirecting to M-Pesa payment...");
                window.location.href = "mpesa-payment.html";
                return;
            }

            console.log("Processing other payment method:", paymentMethod);

            // Disable button during processing for other payment methods
            placeOrderBtn.disabled = true;
            placeOrderBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';

            // Simulate payment processing for other methods
            setTimeout(() => {
                try {
                    // Save order to localStorage
                    let orders = JSON.parse(localStorage.getItem("orders")) || [];
                    orders.push(order);
                    localStorage.setItem("orders", JSON.stringify(orders));

                    // Clear the cart and pending order
                    localStorage.removeItem("cart");
                    localStorage.removeItem("checkoutOrder");
                    localStorage.removeItem("pendingOrder");

                    console.log("Order completed and saved");

                    // Show success message
                    alert(`Order placed successfully!\n\nOrder ID: ${order.orderId}\nTotal: $${total.toFixed(2)}\n\nThank you for your purchase!`);

                    // Redirect to confirmation or home page
                    window.location.href = "index.html";

                } catch (error) {
                    console.error("Error processing order:", error);
                    alert("There was an error processing your order. Please try again.");
                    
                    placeOrderBtn.disabled = false;
                    placeOrderBtn.innerHTML = '<i class="fa-solid fa-lock"></i> Place Order';
                }
            }, 2000);
        });
    } else {
        console.error("Place Order button not found!");
    }

    // ===============================
    // LOAD USER DATA IF LOGGED IN
    // ===============================
    function loadUserData() {
        try {
            const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
            if (loggedInUser) {
                console.log("User logged in:", loggedInUser);
                if (loggedInUser.name) {
                    const names = loggedInUser.name.split(" ");
                    document.getElementById("firstName").value = names[0] || "";
                    document.getElementById("lastName").value = names.slice(1).join(" ") || "";
                }
                if (loggedInUser.email) {
                    document.getElementById("email").value = loggedInUser.email;
                }
            }
        } catch (error) {
            console.error("Error loading user data:", error);
        }
    }

    // ===============================
    // INITIALIZE PAGE
    // ===============================
    loadOrderSummary();
    loadUserData();

    // Auto-update shipping cost based on country
    const countrySelect = document.getElementById("country");
    if (countrySelect) {
        countrySelect.addEventListener("change", function() {
            const country = this.value;
            let newShipping = SHIPPING_COST;
            
            if (country === "US" || country === "CA") {
                newShipping = 15.00;
            } else if (country === "UK" || country === "AU") {
                newShipping = 20.00;
            } else if (country === "KE") {
                newShipping = 10.00;
            }
            
            shippingElement.textContent = "$" + newShipping.toFixed(2);
            
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const newTotal = subtotal + newShipping;
            totalElement.textContent = "$" + newTotal.toFixed(2);

            console.log("Shipping updated for country:", country);
        });
    }

    console.log("Checkout page initialization complete");

    // ===============================
    // M-PESA BUTTON CLICK HANDLER
    // ===============================
    const mpesaButton = document.getElementById("mpesaOption");
    if (mpesaButton) {
        mpesaButton.addEventListener("click", function(e) {
            e.preventDefault();
            console.log("M-Pesa button clicked!");
            
            // Get form data
            const form = document.getElementById("shippingForm");
            
            // Validate form before going to M-Pesa
            if (!form.checkValidity()) {
                alert("Please fill in all shipping information first!");
                form.reportValidity();
                return;
            }

            // Get form values
            const formData = {
                firstName: document.getElementById("firstName").value,
                lastName: document.getElementById("lastName").value,
                email: document.getElementById("email").value,
                phone: document.getElementById("phone").value,
                address: document.getElementById("address").value,
                city: document.getElementById("city").value,
                state: document.getElementById("state").value,
                zipCode: document.getElementById("zipCode").value,
                country: document.getElementById("country").value,
                orderNotes: document.getElementById("orderNotes").value
            };

            // Calculate totals
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const total = subtotal + SHIPPING_COST;

            // Create order object
            const order = {
                orderId: "ORD" + Date.now(),
                date: new Date().toISOString(),
                customer: formData,
                items: cart,
                subtotal: subtotal,
                shipping: SHIPPING_COST,
                total: total,
                paymentMethod: "mpesa",
                status: "pending"
            };

            // Save order for M-Pesa page
            try {
                localStorage.setItem("pendingOrder", JSON.stringify(order));
                console.log("Order saved, redirecting to M-Pesa...");
                
                // Redirect to M-Pesa payment page
                window.location.href = "mpesa-payment.html";
            } catch (error) {
                console.error("Error saving order:", error);
                alert("Unable to proceed to M-Pesa payment. Please try again.");
            }
        });
        
        console.log("M-Pesa button handler attached");
    } else {
        console.error("M-Pesa button not found!");
    }
});