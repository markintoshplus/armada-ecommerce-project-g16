document.addEventListener("DOMContentLoaded", function () {
    // ------------------------------
    // Retrieve and Populate Main Product Details
    // ------------------------------
    let product = JSON.parse(localStorage.getItem("selectedProduct"));
    if (product) {
        document.getElementById("main_img").setAttribute("src", product.image);
        document.getElementById("name").textContent = product.name;
        document.getElementById("price_store").textContent = product.price;
        document.getElementById("genre").textContent = product.genre;
        document.getElementById("ratings").textContent = product.rating;
        document.getElementById("description_final").textContent = product.description;
    }

    // ------------------------------
    // Similar Items Section
    // ------------------------------
    function displaySimilarItems(items) {
        let bottom_ul = document.getElementById("bottom_ul");
        bottom_ul.innerHTML = ""; // Clear previous items

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
            bottom_ul.appendChild(li);
        });
    }

    // Retrieve similar items from localStorage.
    let similarItems = JSON.parse(localStorage.getItem("similarItems")) || [];
    // Filter similar items to only include those with the same genre as the current product.
    similarItems = similarItems.filter(item => item.genre === product.genre);

    if (!similarItems || similarItems.length === 0) {
        // Fallback: if no similar items are found, use a preset list.
        similarItems = [
            { image: "../assets/game-covers/bg3.jpg", name: "Baldur's Gate 3", rating: "20 ratings", genre: product.genre },
            { image: "../assets/game-covers/dmc5.jpg", name: "Devil May Cry 5", rating: "60 ratings", genre: product.genre },
            { image: "../assets/game-covers/ffxvi.jpg", name: "Final Fantasy XVI", rating: "15 ratings", genre: product.genre }
        ];
    }
    displaySimilarItems(similarItems);

    // ------------------------------
    // Quantity and Amount Update
    // ------------------------------
    let quantity_element = document.getElementById("quantity");
    let quantity_num = Number(quantity_element.textContent);

    let amount_element = document.getElementById("total_amount");
    let amount_num = Number(amount_element.textContent);

    let cart_element = document.getElementById("cart");
    let cart_num = Number(cart_element.textContent);

    let up = document.getElementById("up");
    let down = document.getElementById("down");

    up.addEventListener("click", function () {
        quantity_num++;
        amount_num += 10; // Adjust per-unit price if needed.
        quantity_element.textContent = `${quantity_num}`;
        amount_element.textContent = `$${amount_num}`;
    });

    down.addEventListener("click", function () {
        quantity_num--;
        amount_num -= 10;
        if (quantity_num <= 0 || amount_num <= 0) {
            quantity_num = 0;
            amount_num = 0;
        }
        quantity_element.textContent = `${quantity_num}`;
        amount_element.textContent = `$${amount_num}`;
    });

    // ------------------------------
    // Add to Cart and Custom Alert
    // ------------------------------
    let add_to_cart = document.getElementById("add-to-cart");
    let show_alert = document.getElementById("customAlert");
    let close_alert = document.getElementById("closeAlert");
    show_alert.style.display = "none";

    add_to_cart.addEventListener("click", function () {
        if (quantity_num > 0) {
            show_alert.style.display = "flex";
            cart_num++;
            cart_element.textContent = `${cart_num}`;
            // Optionally, store selected product details with quantity.
            localStorage.setItem("pass_cardName", product.name);
            localStorage.setItem("pass_price", product.price);
            localStorage.setItem("pass_quantity", quantity_num);
        }
    });

    close_alert.addEventListener("click", function () {
        show_alert.style.display = "none";
    });
});
