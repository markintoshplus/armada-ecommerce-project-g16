// product-view_script.js

document.addEventListener("DOMContentLoaded", function () {
    /*---------------------------------------------------------
      1) Retrieve and Populate Main Product Details
    ----------------------------------------------------------*/
    let product = JSON.parse(localStorage.getItem("selectedProduct"));
    if (product) {
        // Main image, name, genre, price, and description
        document.getElementById("main_img").setAttribute("src", product.image);
        document.getElementById("name").textContent = product.name;
        document.getElementById("genre").textContent = product.genre;
        document.getElementById("price_store").textContent = product.price;
        document.getElementById("description_final").textContent = product.description;

        // User rating text (e.g., "13 ratings")
        let userRatingText = product.rating || "0 ratings";
        document.getElementById("userRatingCount").textContent = userRatingText;

        // OPTIONAL: If you want a dynamic star count, parse from rating text
        // For now, let's just set 4 out of 5 stars as an example
        setStarRating(4);
    }

    /**
     * Sets the star icons to show 'starCount' filled stars.
     * Expects 5 star elements with IDs star1..star5.
     * @param {number} starCount - Number of filled stars (0-5).
     */
    function setStarRating(starCount) {
        for (let i = 1; i <= 5; i++) {
            const starElem = document.getElementById(`star${i}`);
            if (!starElem) continue; // in case star element doesn't exist

            if (i <= starCount) {
                // Switch from outline to filled
                starElem.classList.remove("fa-star-o");
                starElem.classList.add("fa-star", "checked");
            } else {
                // Switch back to outline
                starElem.classList.remove("fa-star", "checked");
                starElem.classList.add("fa-star-o");
            }
        }
    }

    /*---------------------------------------------------------
      2) Similar Items Section
    ----------------------------------------------------------*/
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

            // Clicking a similar item -> update selectedProduct & reload
            li.addEventListener("click", function () {
                localStorage.setItem("selectedProduct", JSON.stringify(item));
                window.location.href = "product-view.html";
            });

            bottomUl.appendChild(li);
        });
    }

    // Retrieve similar items from localStorage
    let similarItems = JSON.parse(localStorage.getItem("similarItems")) || [];

    // Filter similar items to match current product genre (case-insensitive)
    if (product && product.genre) {
        similarItems = similarItems.filter(
            item => item.genre.toLowerCase() === product.genre.toLowerCase()
        );
    }

    // If no similar items, use fallback
    if (!similarItems || similarItems.length === 0) {
        similarItems = [
            {
                image: "../assets/game-covers/bg3.jpg",
                name: "Baldur's Gate 3",
                rating: "20 ratings",
                genre: product ? product.genre : "Role Playing"
            },
            {
                image: "../assets/game-covers/dmc5.jpg",
                name: "Devil May Cry 5",
                rating: "60 ratings",
                genre: product ? product.genre : "Action"
            }
        ];
    }
    displaySimilarItems(similarItems);

    /*---------------------------------------------------------
      3) Quantity and Amount Update
    ----------------------------------------------------------*/
    let quantityEl = document.getElementById("quantity");
    let quantity = Number(quantityEl.textContent);

    let amountEl = document.getElementById("total_amount");
    let amount = Number(amountEl.textContent);

    let cartEl = document.getElementById("cart");
    let cartCount = Number(cartEl.textContent);

    let upBtn = document.getElementById("up");
    let downBtn = document.getElementById("down");

    // Increase quantity
    upBtn.addEventListener("click", function () {
        quantity++;
        amount += 10; // Adjust per-unit price if needed
        quantityEl.textContent = quantity;
        amountEl.textContent = `$${amount}`;
    });

    // Decrease quantity
    downBtn.addEventListener("click", function () {
        quantity--;
        amount -= 10;
        if (quantity <= 0 || amount <= 0) {
            quantity = 0;
            amount = 0;
        }
        quantityEl.textContent = quantity;
        amountEl.textContent = `$${amount}`;
    });

    /*---------------------------------------------------------
      4) Add to Cart and Custom Alert
    ----------------------------------------------------------*/
    let addToCartBtn = document.getElementById("add-to-cart");
    let alertBox = document.getElementById("customAlert");
    let closeAlert = document.getElementById("closeAlert");

    // Initially hide the alert
    alertBox.style.display = "none";

    addToCartBtn.addEventListener("click", function () {
        if (quantity > 0) {
            cartCount++;
            cartEl.textContent = cartCount;
            alertBox.style.display = "flex";
            // Optionally store more cart data
            localStorage.setItem("pass_cardName", product.name);
            localStorage.setItem("pass_price", product.price);
            localStorage.setItem("pass_quantity", quantity);
        }
    });

    closeAlert.addEventListener("click", function () {
        alertBox.style.display = "none";
    });
});
