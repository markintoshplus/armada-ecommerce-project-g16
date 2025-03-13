document.addEventListener("DOMContentLoaded", function () {
    /*==============================
      1) Retrieve and Populate Main Product Details
    ==============================*/
    let product = JSON.parse(localStorage.getItem("selectedProduct"));
    if (product) {
        // Populate product details
        document.getElementById("main_img").src = product.image;
        document.getElementById("name").textContent = product.name;
        document.getElementById("genre").textContent = product.genre;
        document.getElementById("price_store").textContent = product.price;
        document.getElementById("description_final").textContent = product.description;

        // Set the user rating text (e.g., "13 ratings")
        // Ensure your HTML includes an element with id="userRatingCount" inside the star-rating container.
        const userRatingText = product.rating || "0 ratings";
        if (document.getElementById("userRatingCount")) {
            document.getElementById("userRatingCount").textContent = userRatingText;
        }

        // Set star rating (here we use a default value of 4; you can adjust as needed)
        setStarRating(4);
    }

    /**
     * Helper: Sets the star icons to show starCount filled stars out of 5.
     * Expects star elements with IDs star1, star2, ..., star5.
     * @param {number} starCount - Number of filled stars (0-5)
     */
    function setStarRating(starCount) {
        for (let i = 1; i <= 5; i++) {
            const starElem = document.getElementById(`star${i}`);
            if (!starElem) continue;
            if (i <= starCount) {
                starElem.classList.remove("fa-star-o");
                starElem.classList.add("fa-star", "checked");
            } else {
                starElem.classList.remove("fa-star", "checked");
                starElem.classList.add("fa-star-o");
            }
        }
    }

    /*==============================
      2) Display Similar Items
    ==============================*/
    function displaySimilarItems(items) {
        let bottomUl = document.getElementById("bottom_ul");
        bottomUl.innerHTML = ""; // Clear existing items

        items.forEach(item => {
            let li = document.createElement("li");
            li.className = "similar-item";

            let container = document.createElement("div");

            let img = document.createElement("img");
            img.src = item.image;
            img.className = "bottom_pictures";
            img.alt = item.name;
            container.appendChild(img);

            let titleDiv = document.createElement("div");
            titleDiv.className = "title";

            let p = document.createElement("p");
            p.textContent = item.name;
            titleDiv.appendChild(p);

            let starsDiv = document.createElement("div");
            starsDiv.className = "stars";
            let ratingP = document.createElement("p");
            ratingP.className = "rating";
            ratingP.textContent = item.rating;
            starsDiv.appendChild(ratingP);
            titleDiv.appendChild(starsDiv);

            container.appendChild(titleDiv);
            li.appendChild(container);

            // Make each similar item clickable
            li.addEventListener("click", function () {
                localStorage.setItem("selectedProduct", JSON.stringify(item));
                window.location.href = "product-view.html";
            });

            bottomUl.appendChild(li);
        });
    }

    // Retrieve similar items from localStorage and filter by matching genre (case-insensitive)
    let similarItems = JSON.parse(localStorage.getItem("similarItems")) || [];
    if (product && product.genre) {
        similarItems = similarItems.filter(item =>
            item.genre.toLowerCase() === product.genre.toLowerCase()
        );
    }
    // Fallback if no similar items exist
    if (!similarItems || similarItems.length === 0) {
        similarItems = [
            { image: "../assets/game-covers/bg3.jpg", name: "Baldur's Gate 3", rating: "20 ratings", genre: product ? product.genre : "Role Playing" },
            { image: "../assets/game-covers/dmc5.jpg", name: "Devil May Cry 5", rating: "60 ratings", genre: product ? product.genre : "Action" },
            { image: "../assets/game-covers/ffxvi.jpg", name: "Final Fantasy XVI", rating: "15 ratings", genre: product ? product.genre : "Role Playing" }
        ];
    }
    displaySimilarItems(similarItems);

    /*==============================
      3) Quantity and Amount Update
    ==============================*/
    // Retrieve unit price as a number (strip non-numeric characters)
    let unitPrice = 0;
    if (product && product.price) {
        unitPrice = parseFloat(product.price.replace(/[^0-9\.]+/g, ''));
    }

    let quantityEl = document.getElementById("quantity");
    let amountEl = document.getElementById("total_amount");

    // Initialize quantity and amount
    let quantity = parseInt(quantityEl.textContent) || 0;
    let amount = unitPrice * quantity;
    amountEl.textContent = `$${amount.toFixed(2)}`;

    let upBtn = document.getElementById("up");
    let downBtn = document.getElementById("down");

    upBtn.addEventListener("click", function () {
        quantity++;
        amount = unitPrice * quantity;
        quantityEl.textContent = quantity;
        amountEl.textContent = `$${amount.toFixed(2)}`;
    });

    downBtn.addEventListener("click", function () {
        quantity--;
        if (quantity < 0) quantity = 0;
        amount = unitPrice * quantity;
        quantityEl.textContent = quantity;
        amountEl.textContent = `$${amount.toFixed(2)}`;
    });

    /*==============================
      4) Add to Cart Functionality
    ==============================*/
    let addToCartBtn = document.getElementById("add-to-cart");
    addToCartBtn.addEventListener("click", function () {
        if (quantity <= 0) {
            Swal.fire({
                title: "Quantity Required",
                text: "Please select at least 1 item.",
                icon: "error",
                confirmButtonText: "OK"
            });
            return;
        }
        if (!product) {
            Swal.fire({
                title: "No Product Selected",
                text: "There is no product to add to your cart.",
                icon: "error",
                confirmButtonText: "OK"
            });
            return;
        }

        // Use unitPrice already extracted above
        let numericPrice = unitPrice;

        // Retrieve current cart (or initialize empty array)
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        // Check if product exists in cart (using product.name as identifier)
        let existingItem = cart.find(item => item.name === product.name);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            let cartItem = {
                id: product.id || Date.now(),
                name: product.name,
                image: product.image,
                price: numericPrice,
                quantity: quantity
            };
            cart.push(cartItem);
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        // Update cart counter if exists (assume element with id "cart" shows count)
        let cartCounter = document.getElementById("cart");
        if (cartCounter) {
            let totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCounter.textContent = totalQty;
        }

        Swal.fire({
            title: "Added to Cart!",
            text: `${product.name} has been added to your cart.`,
            icon: "success",
            timer: 1500,
            showConfirmButton: false
        });
    });
});
