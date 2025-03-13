document.addEventListener('DOMContentLoaded', function () {
    /*---------------------------------------------------------
      Section 1: Genre Filtering & Count Update
    ----------------------------------------------------------*/

    /*  
     * DOCU: Attaches click event listeners to all genre links to trigger filtering.
     * @param {Event} e - The click event.
     * @returns {void} - Does not return a value.
     * @throws {None}
     * 
     * Last Updated: 2025-03-13  
     * Author: Mark Cedrick De Vera  
     * Last Updated By: Mark Cedrick De Vera  
     */
    const genreLinks = document.querySelectorAll('.genre-item a');
    genreLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default link behavior
            const selectedGenre = this.querySelector('.genre-name').textContent.trim().toLowerCase();
            filterByGenre(selectedGenre);
        });
    });

    /*  
     * DOCU: Filters product cards based on the provided genre.
     * @param {string} genre - The genre to filter product cards by.
     * @returns {void} - Does not return any value.
     * @throws {None}
     * 
     * Last Updated: 2025-03-13  
     * Author: Mark Cedrick De Vera  
     * Last Updated By: Mark Cedrick De Vera  
     */
    function filterByGenre(genre) {
        const cards = document.querySelectorAll('.product-grid .card');
        cards.forEach(card => {
            const cardGenre = card.getAttribute('data-genre') ? card.getAttribute('data-genre').toLowerCase() : '';
            card.style.display = (genre === 'all genres' || cardGenre === genre) ? 'flex' : 'none';
        });
    }

    /*  
     * DOCU: Updates the count badges for each genre in the sidebar based on available product cards.
     * @returns {void} - Does not return any value.
     * @throws {None}
     * 
     * Last Updated: 2025-03-13  
     * Author: Mark Cedrick De Vera  
     * Last Updated By: Mark Cedrick De Vera  
     */
    function updateGenreCounts() {
        const cards = document.querySelectorAll('.product-grid .card');
        const totalGames = cards.length;
        const genreCounts = {};

        cards.forEach(card => {
            let genre = card.getAttribute('data-genre');
            if (genre) {
                genre = genre.toLowerCase();
                genreCounts[genre] = (genreCounts[genre] || 0) + 1;
            }
        });

        const genreItems = document.querySelectorAll('.genre-item');
        genreItems.forEach(item => {
            const genreNameElem = item.querySelector('.genre-name');
            const countElem = item.querySelector('.genre-count');
            if (genreNameElem && countElem) {
                const genreText = genreNameElem.textContent.trim().toLowerCase();
                countElem.textContent = (genreText === 'all genres') ? totalGames : (genreCounts[genreText] || 0);
            }
        });
    }
    updateGenreCounts();

    /*---------------------------------------------------------
      Section 2: Modal Management (Login & Signup)
    ----------------------------------------------------------*/
    // Login Modal
    const loginModal = document.getElementById("login-modal");
    const loginBtn = document.getElementById("login-btn");
    const loginCloseBtn = document.querySelector("#login-modal .close");

    loginBtn.addEventListener("click", () => {
        loginModal.style.display = "block";
    });
    loginCloseBtn.addEventListener("click", () => {
        loginModal.style.display = "none";
    });
    window.addEventListener("click", (event) => {
        if (event.target === loginModal) {
            loginModal.style.display = "none";
        }
    });

    // Signup Modal
    const signupModal = document.getElementById("signup-modal");
    const signupBtn = document.getElementById("signup-btn");
    const signupCloseBtn = signupModal.querySelector(".close");

    signupBtn.addEventListener("click", () => {
        signupModal.style.display = "block";
    });
    signupCloseBtn.addEventListener("click", () => {
        signupModal.style.display = "none";
    });
    window.addEventListener("click", (event) => {
        if (event.target === signupModal) {
            signupModal.style.display = "none";
        }
    });

    /*---------------------------------------------------------
      Section 3: Cart Access Restriction
    ----------------------------------------------------------*/
    // Prevent access to the cart for users who are not logged in
    const cartButton = document.querySelector('.cart-btn');
    cartButton.addEventListener('click', function (e) {
        if (!localStorage.getItem('currentUser')) {
            e.preventDefault();
            alert('Please log in to access your cart.');
            loginModal.style.display = 'block';
        }
    });

    /*---------------------------------------------------------
      Section 4: Product View Data Extraction
    ----------------------------------------------------------*/
    // When a product card is clicked, store its details in local storage
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        card.addEventListener("click", function () {
            const genre_data = this.getAttribute("data-genre");
            localStorage.setItem("genre_data", genre_data);

            const price = this.querySelector(".card-text").textContent.trim();
            localStorage.setItem("price", price);

            const card_name = this.querySelector(".card-title").textContent.trim();
            localStorage.setItem("card_name", card_name);

            const card_des = this.querySelector(".card-title").getAttribute("data-des");
            localStorage.setItem("des", card_des);

            const matchingRatings = document.querySelectorAll(`.card[data-genre="${genre_data}"] .user-rating`);
            const ratings_arr = [];
            matchingRatings.forEach(ratingElement => {
                ratings_arr.push(ratingElement.textContent.trim());
            });
            localStorage.setItem("selectedRatings", JSON.stringify(ratings_arr));

            const rating = this.querySelector(".user-rating").textContent.trim();
            localStorage.setItem("rating", rating);

            const matchingImages = document.querySelectorAll(`.card[data-genre="${genre_data}"] img`);
            const imageSources = [];
            matchingImages.forEach(img => {
                imageSources.push(img.getAttribute("src"));
            });

            const matching_name = document.querySelectorAll(`.card[data-genre="${genre_data}"] .card-title`);
            const each_name = [];
            matching_name.forEach(name => {
                each_name.push(name.textContent.trim());
            });

            localStorage.setItem("names", JSON.stringify(each_name));
            localStorage.setItem("selectedImages", JSON.stringify(imageSources));
            localStorage.setItem("selected_num", matchingImages.length);
        });
    });

    /*---------------------------------------------------------
      Section 5: User Authentication & Navbar Update
    ----------------------------------------------------------*/

    /*  
     * DOCU: Retrieves the list of registered users from local storage.
     * @returns {Array} - An array of user objects.
     * @throws {None}
     * 
     * Last Updated: 2025-03-13  
     * Author: Mark Cedrick De Vera  
     * Last Updated By: Mark Cedrick De Vera  
     */
    function getRegisteredUsers() {
        const users = localStorage.getItem('registeredUsers');
        return users ? JSON.parse(users) : [];
    }

    /*  
     * DOCU: Saves the provided list of users to local storage.
     * @param {Array} users - An array of user objects.
     * @returns {void} - Does not return any value.
     * @throws {None}
     * 
     * Last Updated: 2025-03-13  
     * Author: Mark Cedrick De Vera  
     * Last Updated By: Mark Cedrick De Vera  
     */
    function setRegisteredUsers(users) {
        localStorage.setItem('registeredUsers', JSON.stringify(users));
    }

    /*  
     * DOCU: Updates the navbar to reflect a logged-in user's state, including greeting and logout functionality.
     * @param {Object} user - The logged-in user's data.
     * @returns {void} - Does not return any value.
     * @throws {None}
     * 
     * Last Updated: 2025-03-13  
     * Author: Mark Cedrick De Vera  
     * Last Updated By: Mark Cedrick De Vera  
     */
    function updateNavbarForLoggedInUser(user) {
        const loginBtn = document.getElementById('login-btn');
        const signupBtn = document.getElementById('signup-btn');
        loginBtn.style.display = "none";
        signupBtn.style.display = "none";

        let userInfoContainer = document.getElementById('user-info');
        if (!userInfoContainer) {
            userInfoContainer = document.createElement('div');
            userInfoContainer.id = 'user-info';
            userInfoContainer.style.display = "flex";
            userInfoContainer.style.alignItems = "center";
            userInfoContainer.style.gap = "0.5rem";
            const navbar = document.querySelector('nav');
            navbar.appendChild(userInfoContainer);
        }
        userInfoContainer.innerHTML = `<span>Welcome, ${user.username}!</span>`;
        const logoutBtn = document.createElement('button');
        logoutBtn.textContent = "Log Out";
        logoutBtn.style.padding = "0.5rem 1rem";
        logoutBtn.style.borderRadius = "10px";
        logoutBtn.style.border = "none";
        logoutBtn.style.backgroundColor = "#b8ace9";
        logoutBtn.style.color = "#5305b3";
        logoutBtn.style.cursor = "pointer";
        logoutBtn.addEventListener('click', function () {
            localStorage.removeItem('currentUser');
            location.reload();
        });
        userInfoContainer.appendChild(logoutBtn);
    }

    // On page load, update navbar if a user is already logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        updateNavbarForLoggedInUser(currentUser);
    }

    // Signup form functionality
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
        if (users.some(user => user.username === username || user.email === email)) {
            alert("An account with this username or email already exists.");
            return;
        }

        const newUser = { fullname, username, email, password };
        users.push(newUser);
        setRegisteredUsers(users);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        alert("Signup successful! You are now logged in.");
        signupForm.reset();
        closeModal('signup-modal');
        updateNavbarForLoggedInUser(newUser);
    });

    // Login form functionality
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

    /*  
     * DOCU: Closes a modal dialog by setting its display property to "none".
     * @param {string} modalId - The ID of the modal element to close.
     * @returns {void} - Does not return any value.
     * @throws {None}
     * 
     * Last Updated: 2025-03-13  
     * Author: Mark Cedrick De Vera  
     * Last Updated By: Mark Cedrick De Vera  
     */
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = "none";
        }
    }

    /*---------------------------------------------------------
      Section 6: Search Functionality
    ----------------------------------------------------------*/
    const searchForm = document.querySelector('.search-field');
    const searchInput = searchForm.querySelector('input[type="text"]');
    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const query = searchInput.value.trim().toLowerCase();
        const cards = document.querySelectorAll('.product-grid .card');
        if (query === '') {
            cards.forEach(card => {
                card.style.display = 'flex';
            });
            return;
        }
        cards.forEach(card => {
            const gameName = card.querySelector('.card-title').textContent.toLowerCase();
            const genre = (card.getAttribute('data-genre') || '').toLowerCase();
            card.style.display = (gameName.includes(query) || genre.includes(query)) ? 'flex' : 'none';
        });
    });
});
