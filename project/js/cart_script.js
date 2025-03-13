document.addEventListener('DOMContentLoaded', () => {
    /**
     * Function to calculate the total price of the items in the cart
     * This will also apply the discount process and update the total.
     */
    function updateTotals() {
        let overallTotal = 0;

        document.querySelectorAll('.cart-item').forEach(item => {
            const price = parseFloat(item.querySelector('.price').textContent.replace('$', ''));
            const discountInput = item.querySelector('input[type="number"]');
            let discount = parseInt(discountInput.value);

            // Sets the discount limit to a minimum of 1% and a maximum of 30%
            discount = Math.min(Math.max(discount, 1), 30);
            discountInput.value = discount;

            // Calculates the discounted price
            const discountedPrice = price * (1 - discount / 100);
            const totalInput = item.querySelector('input[type="text"]');
            totalInput.value = `$${discountedPrice.toFixed(2)}`;

            // Add all the discounted prices in the cart
            overallTotal += discountedPrice;
        });

        document.getElementById('total-amount').textContent = `$${overallTotal.toFixed(2)}`;
    }

    // Update totals when discount input changes
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('input', updateTotals);
    });

    /**
     * This function checks the selected payment option.
     * If the option is 'card', it will show the card info form; otherwise, it hides it.
     */
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    const cardInfo = document.getElementById('card-info');

    paymentRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            cardInfo.style.display = radio.value === 'card' ? 'block' : 'none';
        });
    });

    // Initialize totals on page load
    updateTotals();

    /**
     * Order confirmation modal logic
     */
    const orderModal = document.getElementById("orderModal");
    const submitBtn = document.querySelector(".submit_btn");
    const confirmOrderBtn = document.getElementById("confirmOrderBtn");
    const cancelOrderBtn = document.getElementById("cancelOrderBtn");

    submitBtn.addEventListener("click", (event) => {
        event.preventDefault(); // Prevents form submission
        if (!validateForm()) return;
        orderModal.style.display = "flex";
    });

    cancelOrderBtn.addEventListener("click", () => {
        orderModal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
        if (e.target === orderModal) {
            orderModal.style.display = "none";
        }
    });

    confirmOrderBtn.addEventListener("click", () => {
        alert("Your order has been placed successfully!");
        orderModal.style.display = "none";
    });

    /**
     * Delete confirmation modal logic
     */
    let currentItemToDelete = null;
    const deleteModal = document.getElementById('deleteModal');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

    // Show delete modal when clicking the close button
    document.querySelectorAll('.close').forEach(button => {
        button.addEventListener('click', (e) => {
            currentItemToDelete = e.target.closest('.cart-item');
            deleteModal.style.display = 'flex';
        });
    });

    // Function to hide delete modal
    function hideDeleteModal() {
        deleteModal.style.display = 'none';
        currentItemToDelete = null;
    }

    // Update cart counter
    function updateCartCounter() {
        const cartCounter = document.getElementById('cart-counter');
        const cartItems = document.querySelectorAll('.cart-item');
        cartCounter.textContent = cartItems.length;
    }

    // Initial count on page load
    updateCartCounter();

    // Confirm item deletion and update cart
    confirmDeleteBtn.addEventListener('click', () => {
        if (currentItemToDelete) {
            currentItemToDelete.remove();
            updateCartCounter(); // Update cart counter after removal
            updateTotals(); // Update total price after removal
        }
        hideDeleteModal();
    });

    // Cancel deletion
    cancelDeleteBtn.addEventListener('click', hideDeleteModal);

    /**
     * Form validation
     */
    function validateForm() {
        const paymentType = document.querySelector('input[name="payment"]:checked').value;
        let allFieldsFilled = true;

        document.querySelectorAll(".shipping-info input[type='text']").forEach((input) => {
            if (input.id === "address2") return; // Address 2 is optional

            // For COD, ignore card fields
            if (paymentType === "cod" && input.closest("#card-info")) return;

            if (input.value.trim() === "") {
                allFieldsFilled = false;
                input.style.border = "2px solid red"; // Highlight empty fields
            } else {
                input.style.border = ""; // Reset border if filled
            }
        });

        if (!allFieldsFilled) {
            alert("Please fill out all required fields before placing your order.");
            return false;
        }

        return true;
    }
});
