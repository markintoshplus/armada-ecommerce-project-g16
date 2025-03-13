var quantity = document.getElementById("quantity").textContent;
var quantity_element = document.getElementById("quantity");
var quantity_num = Number(quantity);

var amount = document.getElementById("total_amount").textContent;
var amount_element = document.getElementById("total_amount");
var amount_num = Number(amount);

var up = document.getElementById("up");
var down = document.getElementById("down");

var cart = document.getElementById("cart").textContent;
var cart_element = document.getElementById("cart");
var cart_num = Number(cart);

// var add_to_cart = document.getElementById("add-to-cart");

up.addEventListener("click", function () {
    quantity_num++;
    amount_num += 10;
    if (quantity_num <= 0 || amount_num <= 0) {
        quantity_num = 0;
        amount_num = 0;
    }
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

// value = parseFloat(document.getElementById("value"). value);

var add_to_cart = document.getElementById("add-to-cart");
var show_alert = document.getElementById("customAlert");
var close_alert = document.getElementById("closeAlert");
show_alert.style.display = "none";
add_to_cart.addEventListener("click", function () {

    if (quantity_num > 0) {
        show_alert.style.display = "flex";
        cart_num++;
        cart_element.textContent = `${cart_num}`;
        // DATA TO PASS FOR ADD TO CART
        localStorage.setItem("pass_cardName", card_name_store);
        localStorage.setItem("pass_price", price_store.textContent);
        localStorage.setItem("pass_quantity", quantity_num);
    }

});

close_alert.addEventListener("click", function () {
    show_alert.style.display = "none";
});


//GET DATA FROM DASHBOARD
var genre_data = localStorage.getItem("genre_data");
var price = localStorage.getItem("price");
var card_name = localStorage.getItem("card_name");
var rating = localStorage.getItem("rating");
// var rate = localStorage.getItem("rate")
var picc = localStorage.getItem("selectedImage");
var selected_num = localStorage.getItem("selected_num");
var selectedImages = JSON.parse(localStorage.getItem("selectedImages"));
var names = JSON.parse(localStorage.getItem("names"));
var des = localStorage.getItem("des");
var selectedRatings = JSON.parse(localStorage.getItem("selectedRatings"));




//PUT DATA FROM DASHBOARD TO PRODUCT VIEW
var genre = document.getElementById("genre");
genre.textContent = genre_data;

var price_store = document.getElementById("price_store");
price_store.textContent = price;

var card_name_store = document.getElementById("name");
card_name_store.textContent = card_name;

var rating_store = document.getElementById("ratings");
rating_store.textContent = rating;

document.getElementById("main_img").setAttribute("src", picc);
var left_ul = document.getElementById("left_ul");

document.getElementById("description_final").textContent = des


for (let i = 0; i < 4; i++) {
    var small_pic = document.getElementById(`top${i}`);
    if (selectedImages[i] != undefined) {
        small_pic.setAttribute("src", selectedImages[i]);
    } else {
        var li = document.getElementById(`li${i}`);
        left_ul.removeChild(li);
    }
}

var bottom_div = document.getElementById("bottom_ul");

for (let j = 0; j < 5; j++) {
    var bottom_pic = document.getElementById(`top2_${j}`)
    var bottom_p = document.getElementById(`bottom_p${j}`);
    var rating_bottom = document.getElementById(`rating_bottom${j}`);
    if (selectedImages[j] != null || names[j] != null) {
        bottom_pic.setAttribute("src", selectedImages[j]);
        bottom_p.textContent = names[j]
        rating_bottom.textContent = selectedRatings[j];
    } else {
        var bottom_del = document.getElementById(`bottom_li${j}`);
        bottom_div.removeChild(bottom_del);
    }
}

