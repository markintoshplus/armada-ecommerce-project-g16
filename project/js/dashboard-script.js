// Select all genre links
const genreLinks = document.querySelectorAll('.genre-item a');

genreLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent default link behavior

        // Get the genre name from the clicked element (e.g., "Adventure")
        const selectedGenre = this.querySelector('.genre-name').textContent.trim().toLowerCase();

        // Call filter function with the selected genre
        filterByGenre(selectedGenre);
    });
}); 

function filterByGenre(genre) {
    // Get all product cards from the grid container
    const cards = document.querySelectorAll('.product-grid .card');

    cards.forEach(card => {
        // Get the card's genre from its data attribute and convert to lowercase
        const cardGenre = card.getAttribute('data-genre') ? card.getAttribute('data-genre').toLowerCase() : '';

        // If "all genres" is selected or the card's genre matches, show it; otherwise hide it
        if (genre === 'all genres' || cardGenre === genre) {
            card.style.display = 'flex'; // Adjust as needed (block, flex, etc.)
        } else {
            card.style.display = 'none';
        }
    });
}

function updateGenreCounts() {
    // Get all product cards
    const cards = document.querySelectorAll('.product-grid .card');
    const totalGames = cards.length;
    const genreCounts = {};

    // Count cards for each genre based on the data attribute
    cards.forEach(card => {
        let genre = card.getAttribute('data-genre');
        if (genre) {
            genre = genre.toLowerCase();
            genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        }
    });

    // Update the count badge for each genre item in the sidebar
    const genreItems = document.querySelectorAll('.genre-item');
    genreItems.forEach(item => {
        const genreNameElem = item.querySelector('.genre-name');
        const countElem = item.querySelector('.genre-count');
        if (genreNameElem && countElem) {
            // Get genre name text and convert to lowercase
            const genreText = genreNameElem.textContent.trim().toLowerCase();
            if (genreText === 'all genres') {
                // Set the count to total number of games
                countElem.textContent = totalGames;
            } else {
                // Otherwise, set count based on matching genre
                countElem.textContent = genreCounts[genreText] || 0;
            }
        }
    });
}

// Call this function after loading or updating your product cards
updateGenreCounts();

// Get modal element
const modal = document.getElementById("login-modal");
// Get button that opens the modal
const loginBtn = document.getElementById("login-btn");
// Get the close button element
const loginCloseBtn = document.querySelector(".modal .close");

// When the user clicks the login button, open the modal
loginBtn.addEventListener("click", () => {
    modal.style.display = "block";
});

// When the user clicks on the close button, close the modal
loginCloseBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

// When the user clicks anywhere outside the modal content, close the modal
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

// Get the modal element for sign-up
const signupModal = document.getElementById("signup-modal");
// Get the sign-up button that opens the modal
const signupBtn = document.getElementById("signup-btn");
// Get the close button element (assumes it's the first element with the "close" class inside the modal)
const signupCloseBtn = signupModal.querySelector(".close");

// When the user clicks the sign-up button, open the modal
signupBtn.addEventListener("click", () => {
    signupModal.style.display = "block";
});

// When the user clicks on the close button, close the modal
signupCloseBtn.addEventListener("click", () => {
    signupModal.style.display = "none";
});

// When the user clicks anywhere outside the modal content, close the modal
window.addEventListener("click", (event) => {
    if (event.target === signupModal) {
        signupModal.style.display = "none";
    }
});

//GETTING DATA FOR PRODUCT VIEW
var get_genre = document.querySelectorAll(".card");

get_genre.forEach(genre_name => {
    genre_name.addEventListener("click", function() {
        var genre_data = this.getAttribute("data-genre");
        localStorage.setItem("genre_data", genre_data); 

        var price = this.querySelector(".card-text").textContent.trim();
        localStorage.setItem("price", price); 

        var card_name = this.querySelector(".card-title").textContent.trim();
        localStorage.setItem("card_name", card_name);

        var card_des = this.querySelector(".card-title").getAttribute("data-des");
        localStorage.setItem("des", card_des);
        
        var matchingRatings = document.querySelectorAll(`.card[data-genre="${genre_data}"] .user-rating`);
        var ratings_arr = [];
        matchingRatings.forEach(ratingElement => {
            ratings_arr.push(ratingElement.textContent.trim()); 
        });
        localStorage.setItem("selectedRatings", JSON.stringify(ratings_arr));

        var rating = this.querySelector(".user-rating").textContent.trim();
        localStorage.setItem("rating", rating);

        var matchingImages = document.querySelectorAll(`.card[data-genre="${genre_data}"] img`);

        var imageSources = []; 
        matchingImages.forEach(img => {

            imageSources.push(img.getAttribute("src")); 
        });

        var matching_name = document.querySelectorAll(`.card[data-genre="${genre_data}"] .card-title`);
        var each_name = [];

        matching_name.forEach(name => {
            each_name.push(name.textContent.trim()); // Get text content
        });

        localStorage.setItem("names", JSON.stringify(each_name));
        localStorage.setItem("selectedImages", JSON.stringify(imageSources));
        localStorage.setItem("selected_num", matchingImages.length);

document.addEventListener('DOMContentLoaded', function () {
    // Check if a user is already logged in on page load
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        updateNavbarForLoggedInUser(currentUser);
    }

    // Helper functions for registered users
    function getRegisteredUsers() {
        const users = localStorage.getItem('registeredUsers');
        return users ? JSON.parse(users) : [];
    }

    function setRegisteredUsers(users) {
        localStorage.setItem('registeredUsers', JSON.stringify(users));
    }

    // SIGN UP FUNCTIONALITY
    const signupForm = document.getElementById('signupForm');
    signupForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const fullname = signupForm.fullname.value.trim();
        const username = signupForm.username.value.trim();
        const email = signupForm.email.value.trim();
        const password = signupForm.password.value;
        const passwordConfirm = signupForm.password_confirm.value;

        if (password !== passwordConfirm) {
            alert("Passwords do not match!");
            return;
        }

        let users = getRegisteredUsers();

        // Check if username or email already exists
        if (users.some(user => user.username === username || user.email === email)) {
            alert("An account with this username or email already exists.");
            return;
        }

        // Create a new user object
        const newUser = { fullname, username, email, password };
        users.push(newUser);
        setRegisteredUsers(users);

        // Set the new user as the current logged in user
        localStorage.setItem('currentUser', JSON.stringify(newUser));

        alert("Signup successful! You are now logged in.");
        signupForm.reset();
        closeModal('signup-modal');
        updateNavbarForLoggedInUser(newUser);
    });

    // LOGIN FUNCTIONALITY
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const usernameOrEmail = loginForm.username.value.trim();
        const password = loginForm.password.value;

        const users = getRegisteredUsers();
        if (users.length === 0) {
            alert("No registered users found. Please sign up first.");
            return;
        }

        // Find the user that matches the entered username/email and password
        const foundUser = users.find(user =>
            (user.username === usernameOrEmail || user.email === usernameOrEmail) &&
            user.password === password
        );

        if (foundUser) {
            alert("Login successful!");
            loginForm.reset();
            closeModal('login-modal');
            localStorage.setItem('currentUser', JSON.stringify(foundUser));
            updateNavbarForLoggedInUser(foundUser);
        } else {
            alert("Invalid credentials. Please try again.");
        }
    });

    // Helper function to close a modal by id
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = "none";
        }
    }

    // Update the navbar to show the logged in state
    function updateNavbarForLoggedInUser(user) {
        // Hide the default login and signup buttons
        const loginBtn = document.getElementById('login-btn');
        const signupBtn = document.getElementById('signup-btn');
        loginBtn.style.display = "none";
        signupBtn.style.display = "none";

        // Create a container for the logged in user's info if it doesn't already exist
        let userInfoContainer = document.getElementById('user-info');
        if (!userInfoContainer) {
            userInfoContainer = document.createElement('div');
            userInfoContainer.id = 'user-info';
            userInfoContainer.style.display = "flex";
            userInfoContainer.style.alignItems = "center";
            userInfoContainer.style.gap = "0.5rem";
            // Append the container to the navbar (adjust where you want it to appear)
            const navbar = document.querySelector('nav');
            navbar.appendChild(userInfoContainer);
        }
        userInfoContainer.innerHTML = `<span>Welcome, ${user.username}!</span>`;

        // Create and add a logout button
        const logoutBtn = document.createElement('button');
        logoutBtn.textContent = "Log Out";
        logoutBtn.style.padding = "0.5rem 1rem";
        logoutBtn.style.borderRadius = "10px";
        logoutBtn.style.border = "none";
        logoutBtn.style.backgroundColor = "#b8ace9";
        logoutBtn.style.color = "#5305b3";
        logoutBtn.style.cursor = "pointer";
        logoutBtn.addEventListener('click', function () {
            // Remove only the current user so the registered data remains for future logins
            localStorage.removeItem('currentUser');
            location.reload();
        });
        userInfoContainer.appendChild(logoutBtn);
    }
});

// Get the search form element
const searchForm = document.querySelector('.search-field');
const searchInput = searchForm.querySelector('input[type="text"]');

searchForm.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form submission
    const query = searchInput.value.trim().toLowerCase();
    const cards = document.querySelectorAll('.product-grid .card');

    // If query is empty, show all cards
    if (query === '') {
        cards.forEach(card => {
            card.style.display = 'flex';
        });
        return;
    }

    // Filter the product cards based on game title or genre
    cards.forEach(card => {
        const gameName = card.querySelector('.card-title').textContent.toLowerCase();
        const genre = (card.getAttribute('data-genre') || '').toLowerCase();

        if (gameName.includes(query) || genre.includes(query)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
});

