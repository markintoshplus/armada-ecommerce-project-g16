document.addEventListener('DOMContentLoaded', () => {
    // --------- Existing Cart Rendering and Update Logic ---------
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartList = document.querySelector(".list-of-orders ul");
    const cartCounter = document.getElementById('cart-counter');
    const totalAmountEl = document.getElementById('total-amount');

    function updateCartCounter() {
        let totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartCounter.textContent = totalQty;
    }

    function renderCartItems(itemsToRender = cartItems) {
        cartList.innerHTML = ""; // Clear existing content
        if (itemsToRender.length === 0) {
            const emptyCartHTML = `
          <li class="empty-cart-message">
            <img src="/project/assets/icons/empty_cart.png" alt="Empty cart">
            <h3>Your Cart is Empty</h3>
            <p>Looks like you haven't added any items yet</p>
            <a href="dashboard.html" class="continue-shopping-btn">Continue Shopping</a>
          </li>
        `;
            cartList.insertAdjacentHTML("beforeend", emptyCartHTML);
        } else {
            itemsToRender.forEach((item) => {
                const cartItemHTML = `
            <li class="cart-item" data-id="${item.id}">
              <img src="${item.image}" alt="${item.name}">
              <div>
                <p class="item-name">${item.name}</p>
                <span class="price">$${item.price.toFixed(2)}</span>
              </div>
              <div class="input-group">
                <label>Quantity</label>
                <input type="number" value="${item.quantity}" min="1">
              </div>
              <div class="input-group">
                <label>Total</label>
                <input type="text" value="$${(item.price * item.quantity).toFixed(2)}" readonly>
              </div>
              <button class="close">X</button>
            </li>
          `;
                cartList.insertAdjacentHTML("beforeend", cartItemHTML);
            });
        }
        updateCartCounter();
        updateTotals();
    }

    function updateTotals() {
        let overallTotal = 0;
        Array.from(cartList.children).forEach((cartItemElement, index) => {
            const quantityInput = cartItemElement.querySelector('input[type="number"]');
            if (!quantityInput) return;
            const quantity = parseInt(quantityInput.value) || 1;
            cartItems[index].quantity = quantity;
            overallTotal += cartItems[index].price * quantity;
        });
        localStorage.setItem('cart', JSON.stringify(cartItems));
        totalAmountEl.textContent = `$${overallTotal.toFixed(2)}`;
    }

    function handleDeleteItem(itemElement) {
        const itemId = itemElement.dataset.id;
        cartItems = cartItems.filter(item => item.id.toString() !== itemId);
        localStorage.setItem('cart', JSON.stringify(cartItems));
        renderCartItems();
    }

    cartList.addEventListener('input', (e) => {
        if (e.target.matches('input[type="number"]')) {
            updateTotals();
        }
    });

    cartList.addEventListener('click', (e) => {
        if (e.target.classList.contains('close')) {
            const currentItem = e.target.closest('.cart-item');
            Swal.fire({
                title: 'Remove From Cart',
                text: 'Are you sure you want to remove this item?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Remove Item'
            }).then((result) => {
                if (result.isConfirmed) {
                    handleDeleteItem(currentItem);
                    Swal.fire(
                        'Removed!',
                        'Item has been removed from your cart.',
                        'success'
                    );
                }
            });
        }
    });

    // Optional: Cart search functionality
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const searchTerm = searchInput.value.toLowerCase().trim();
            const filteredItems = cartItems.filter(item =>
                item.name.toLowerCase().includes(searchTerm)
            );
            renderCartItems(filteredItems);
        });
    }

    renderCartItems();

    // --------- Shipping Information Form Submission  ---------
    const shippingForm = document.querySelector(".shipping-info");
    if (shippingForm) {
        shippingForm.addEventListener("submit", (event) => {
            event.preventDefault();
            if (validateShippingForm()) {
                Swal.fire({
                    title: 'Confirm Your Order',
                    text: 'Are you sure you want to place your order?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, place order'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Order processing logic here, e.g., send data to server
                        localStorage.removeItem('cart'); // Clear the cart
                        Swal.fire({
                            title: 'Order Placed!',
                            text: 'Your order has been placed successfully!',
                            icon: 'success',
                            timer: 2500,
                            showConfirmButton: false
                        }).then(() => {
                            window.location.href = 'dashboard.html';
                        });
                    }
                });
            }
        });
    }

    /**
     * Validates the shipping information form.
     * Skips validation for inputs inside #card-info if payment type is "cod" (Epic Cash).
     */
    function validateShippingForm() {
        let isValid = true;
        const paymentType = document.querySelector('input[name="payment"]:checked').value;
        // Get all text inputs within the shipping-info form.
        const inputs = shippingForm.querySelectorAll("input[type='text']");

        inputs.forEach((input) => {
            // If payment is Epic Cash ("cod"), skip fields inside #card-info.
            if (paymentType === "cod" && input.closest("#card-info") !== null) {
                return;
            }
            // Skip optional field (e.g., address2) if applicable.
            if (input.id === "address2") return;

            if (input.value.trim() === "") {
                isValid = false;
                input.style.border = "2px solid red";
            } else {
                input.style.border = "";
            }
        });

        if (!isValid) {
            Swal.fire({
                title: 'Incomplete Form',
                text: 'Please fill out all required fields before placing your order.',
                icon: 'error',
                confirmButtonColor: '#3085d6'
            });
        }
        return isValid;
    }

    // --------- Payment Method Toggle  ---------
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    const cardInfo = document.getElementById("card-info");
    paymentRadios.forEach(radio => {
        radio.addEventListener("change", () => {
            cardInfo.style.display = radio.value === "card" ? "block" : "none";
        });
    });
});
