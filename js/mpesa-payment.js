// ===============================
// M-PESA PAYMENT PAGE SCRIPT
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    // ===============================
    // GET PENDING ORDER
    // ===============================
    function getPendingOrder() {
        try {
            const orderData = localStorage.getItem("pendingOrder");
            return orderData ? JSON.parse(orderData) : null;
        } catch (error) {
            console.error("Error reading pending order:", error);
            return null;
        }
    }

    // ===============================
    // INITIALIZE
    // ===============================
    const order = getPendingOrder();

    if (!order) {
        alert("No pending order found. Redirecting to checkout...");
        window.location.href = "checkout.html";
        return;
    }

    // DOM Elements
    const orderIdElement = document.getElementById("orderId");
    const itemCountElement = document.getElementById("itemCount");
    const totalAmountElement = document.getElementById("totalAmount");
    const mpesaForm = document.getElementById("mpesaPaymentForm");
    const payBtn = document.getElementById("payBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    const mpesaFormSection = document.getElementById("mpesaForm");
    const paymentStatusSection = document.getElementById("paymentStatus");
    const statusMessage = document.getElementById("statusMessage");
    const statusDetails = document.getElementById("statusDetails");
    const statusBackBtn = document.getElementById("statusBackBtn");
    const mpesaPhoneInput = document.getElementById("mpesaPhone");

    // ===============================
    // DISPLAY ORDER INFORMATION
    // ===============================
    function displayOrderInfo() {
        orderIdElement.textContent = order.orderId;
        itemCountElement.textContent = order.items.length;
        
        // Convert USD to KES (approximate rate: 1 USD = 130 KES)
        const totalInKES = (order.total * 130).toFixed(2);
        totalAmountElement.textContent = `KES ${totalInKES}`;
    }

    // ===============================
    // AUTO-FILL PHONE NUMBER
    // ===============================
    function autoFillPhone() {
        if (order.customer && order.customer.phone) {
            let phone = order.customer.phone.replace(/\D/g, ''); // Remove non-digits
            
            // If phone starts with country code, remove it
            if (phone.startsWith('254')) {
                phone = phone.substring(3);
            } else if (phone.startsWith('0')) {
                phone = phone.substring(1);
            }
            
            mpesaPhoneInput.value = phone;
        }
    }

    // ===============================
    // HANDLE M-PESA PAYMENT
    // ===============================
    mpesaForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const phonePrefix = document.getElementById("phonePrefix").value;
        const phoneNumber = mpesaPhoneInput.value.trim();

        if (!phoneNumber || phoneNumber.length !== 9) {
            alert("Please enter a valid 9-digit phone number");
            return;
        }

        const fullPhone = phonePrefix + phoneNumber;

        // Disable form
        payBtn.disabled = true;
        payBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

        // Simulate STK Push
        setTimeout(() => {
            initiatePayment(fullPhone);
        }, 1500);
    });

    // ===============================
    // INITIATE PAYMENT
    // ===============================
    function initiatePayment(phoneNumber) {
        // Hide form, show processing status
        mpesaFormSection.style.display = "none";
        paymentStatusSection.classList.add("active", "processing");
        paymentStatusSection.querySelector("i").className = "fa-solid fa-spinner fa-spin";
        
        statusMessage.textContent = "Processing Payment...";
        statusDetails.textContent = `STK Push sent to ${phoneNumber}. Please check your phone and enter your M-Pesa PIN.`;

        // Save payment attempt
        order.mpesaPhone = phoneNumber;
        order.paymentAttemptTime = new Date().toISOString();

        // Simulate payment verification (in real app, this would poll your backend)
        setTimeout(() => {
            // Randomly simulate success/failure for demo
            const isSuccess = Math.random() > 0.2; // 80% success rate

            if (isSuccess) {
                handlePaymentSuccess();
            } else {
                handlePaymentFailure();
            }
        }, 5000); // 5 seconds processing time
    }

    // ===============================
    // HANDLE PAYMENT SUCCESS
    // ===============================
    function handlePaymentSuccess() {
        paymentStatusSection.classList.remove("processing");
        paymentStatusSection.classList.add("success");
        paymentStatusSection.querySelector("i").className = "fa-solid fa-check-circle";

        statusMessage.textContent = "Payment Successful!";
        statusDetails.textContent = `Your payment of KES ${(order.total * 130).toFixed(2)} has been received. Transaction ID: MPE${Date.now()}`;

        // Update order status
        order.status = "paid";
        order.paymentConfirmedTime = new Date().toISOString();
        order.transactionId = `MPE${Date.now()}`;

        // Save completed order
        try {
            let orders = JSON.parse(localStorage.getItem("orders")) || [];
            orders.push(order);
            localStorage.setItem("orders", JSON.stringify(orders));

            // Clear cart and pending order
            localStorage.removeItem("cart");
            localStorage.removeItem("checkoutOrder");
            localStorage.removeItem("pendingOrder");

        } catch (error) {
            console.error("Error saving order:", error);
        }

        // Show back button
        statusBackBtn.style.display = "block";
        statusBackBtn.textContent = "Continue Shopping";
        statusBackBtn.onclick = () => {
            window.location.href = "index.html";
        };

        // Auto-redirect after 5 seconds
        setTimeout(() => {
            window.location.href = "index.html";
        }, 5000);
    }

    // ===============================
    // HANDLE PAYMENT FAILURE
    // ===============================
    function handlePaymentFailure() {
        paymentStatusSection.classList.remove("processing");
        paymentStatusSection.classList.add("failed");
        paymentStatusSection.querySelector("i").className = "fa-solid fa-times-circle";

        statusMessage.textContent = "Payment Failed";
        statusDetails.textContent = "The payment was cancelled or failed. Please try again or use a different payment method.";

        // Show retry button
        statusBackBtn.style.display = "block";
        statusBackBtn.textContent = "Try Again";
        statusBackBtn.onclick = () => {
            // Reset form
            mpesaFormSection.style.display = "block";
            paymentStatusSection.classList.remove("active", "failed");
            payBtn.disabled = false;
            payBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send STK Push';
        };
    }

    // ===============================
    // CANCEL BUTTON
    // ===============================
    cancelBtn.addEventListener("click", function() {
        if (confirm("Are you sure you want to cancel this payment and return to checkout?")) {
            window.location.href = "checkout.html";
        }
    });

    // ===============================
    // FORMAT PHONE INPUT
    // ===============================
    mpesaPhoneInput.addEventListener("input", function(e) {
        // Remove non-digits
        let value = e.target.value.replace(/\D/g, '');
        
        // Limit to 9 digits
        if (value.length > 9) {
            value = value.substring(0, 9);
        }
        
        e.target.value = value;
    });

    // ===============================
    // INITIALIZE PAGE
    // ===============================
    displayOrderInfo();
    autoFillPhone();

    // Prevent accidental page close during payment
    window.addEventListener("beforeunload", function(e) {
        if (paymentStatusSection.classList.contains("processing")) {
            e.preventDefault();
            e.returnValue = "Payment is in progress. Are you sure you want to leave?";
            return e.returnValue;
        }
    });

});