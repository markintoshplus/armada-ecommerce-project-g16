document.addEventListener('DOMContentLoaded', () => {
    // Cart data and elements
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartList = document.querySelector('.list-of-orders ul');
    const searchInput = document.getElementById('searchInput'); 
    const cartCounter = document.getElementById('cart-counter');
    let currentItemToDelete = null;


    
    function updateCartCounter() {
        cartCounter.textContent = cartItems.length;
    }

    /**
     * Function to get items stored in local storage
     * This will append the items to the page
     */
    function renderCartItems(itemsToRender = cartItems) {
        cartList.innerHTML = ''; // Clear existing content
    
        if (itemsToRender.length === 0) {
            // Show empty cart message
            const emptyCartHTML = `
                <li class="empty-cart-message">
                    <img src="/project/assets/icons/empty_cart.png" alt="Empty cart">
                    <h3>Your Cart is Empty</h3>
                    <p>Looks like you haven't added any items yet</p>
                    <a href="dashboard.html" class="continue-shopping-btn">Continue Shopping</a>
                </li>
            `;
            cartList.insertAdjacentHTML('beforeend', emptyCartHTML);
        } else {
            // Show regular cart items
            itemsToRender.forEach((item) => {
                const cartItemHTML = `
                    <li class="cart-item" data-id="${item.id}">
                        <img src="${item.image}" alt="${item.title}">
                        <div>
                            <p class="item-name">${item.title}</p>
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
                cartList.insertAdjacentHTML('beforeend', cartItemHTML);
            });
        }
    
        updateCartCounter();
        updateTotals();
    }

    /**
     * Function to calculate the price and quantity of each items
     * This will also display the total cost of the items in the cart
     */
    function updateTotals() {
        let overallTotal = 0;

        cartItems.forEach((item, index) => {
            const quantityInput = cartList.children[index]?.querySelector('input[type="number"]');
            if (!quantityInput) return;

            const quantity = parseInt(quantityInput.value) || 1;
            cartItems[index].quantity = quantity;

            const total = item.price * quantity;
            overallTotal += total;
        });

        localStorage.setItem('cart', JSON.stringify(cartItems));
        document.getElementById('total-amount').textContent = `$${overallTotal.toFixed(2)}`;
    }

    /**
     * Function to delete an item to the list
     */
    function handleDeleteItem(itemElement) {
        const itemId = itemElement.dataset.id;
        cartItems = cartItems.filter(item => item.id !== itemId);
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
            currentItemToDelete = e.target.closest('.cart-item');
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
                    handleDeleteItem(currentItemToDelete);
                    Swal.fire(
                        'Removed!',
                        'Item has been removed from your cart.',
                        'success'
                    );
                }
            });
        }
    });

    
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    const cardInfo = document.getElementById('card-info');
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            cardInfo.style.display = radio.value === 'card' ? 'block' : 'none';
        });
    });

    
    const submitBtn = document.querySelector(".submit_btn");
    if (submitBtn) {
        submitBtn.addEventListener("click", (event) => {
            event.preventDefault();
            console.log("Submit button clicked!"); 
            if (validateForm()) {
                console.log("Form is valid");
                Swal.fire({
                    title: 'Confirm Your Order',
                    text: 'Are you sure you want to proceed with your order?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Confirm Order'
                }).then((result) => {
                    if (result.isConfirmed) {
                        localStorage.removeItem('cart');
                        Swal.fire({
                            title: 'Order Placed!',
                            text: 'Your order has been placed successfully!',
                            icon: 'success',
                            confirmButtonColor: '#3085d6',
                            timer: 2500
                        }).then(() => {
                            cartItems = [];
                            renderCartItems();
                            window.location.href = 'dashboard.html';
                        });
                    }
                });
            } else {
                console.log("Form is invalid");
            }
        });
    }

    /**
     * Function to validate the content of the form
     * this also checks what payment type is selected to prevent false positive on hidden input box
     */
    function validateForm() {
        const paymentType = document.querySelector('input[name="payment"]:checked').value;
        let allFieldsFilled = true;
        let emptyFields = [];

        document.querySelectorAll(".shipping-info input[type='text']").forEach((input) => {
            if (input.id === "address2") return;
            if (paymentType === "cod" && input.closest("#card-info")) return;

            if (input.value.trim() === "") {
                allFieldsFilled = false;
                input.style.border = "2px solid red";

                const fieldName = input.placeholder || input.name || "Required field";
                emptyFields.push(fieldName);
            } else {
                input.style.border = "";
            }
            console.log(`Input ${input.id} value: ${input.value}, allFieldsFilled: ${allFieldsFilled}`);
        });

        console.log(`allFieldsFilled: ${allFieldsFilled}, emptyFields: ${emptyFields}`);

        if (!allFieldsFilled) {
            Swal.fire({
                title: 'Incomplete Form',
                html: `Please fill out all required fields before placing your order.<br><br>`,
                icon: 'error',
                confirmButtonColor: '#3085d6'
            });
            return false;
        }
        console.log("Validate form returned true");
        return true;
    }
     /**
      * Function to allow search in cart
      */
     searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const filteredItems = cartItems.filter(item => 
            item.title.toLowerCase().includes(searchTerm)
        );
        renderCartItems(filteredItems);
    });

    renderCartItems();
});