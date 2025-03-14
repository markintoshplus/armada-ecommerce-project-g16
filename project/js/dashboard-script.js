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

    /*  
     * DOCU: Switches from the login modal to the signup modal when the link is clicked.
     * @param {Event} e - The click event.
     * @returns {void} - Does not return any value.
     * @throws {None}
     * 
     * Last Updated: 2025-03-13  
     * Author: Mark Cedrick De Vera  
     * Last Updated By: Mark Cedrick De Vera  
     */
    const switchToSignup = document.getElementById('switch-to-signup');
    switchToSignup.addEventListener('click', function (e) {
        e.preventDefault();
        loginModal.style.display = 'none';
        signupModal.style.display = 'block';
    });

    /*  
     * DOCU: Switches from the signup modal to the login modal when the link is clicked.
     * @param {Event} e - The click event.
     * @returns {void} - Does not return any value.
     * @throws {None}
     * 
     * Last Updated: 2025-03-13  
     * Author: Mark Cedrick De Vera  
     * Last Updated By: Mark Cedrick De Vera  
     */
    const switchToLogin = document.getElementById('switch-to-login');
    switchToLogin.addEventListener('click', function (e) {
        e.preventDefault();
        signupModal.style.display = 'none';
        loginModal.style.display = 'block';
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
    // When a product card is clicked, store its complete details in localStorage
    const productCards = document.querySelectorAll('.product-grid .card');
    productCards.forEach(card => {
        card.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default navigation

            // Retrieve details from the clicked card using data attributes and inner text.
            const selectedGenre = this.getAttribute('data-genre').trim().toLowerCase();
            const imageLocation = this.getAttribute('data-image').trim();
            const price = this.querySelector('.card-text').textContent.trim();
            const cardName = this.querySelector('.card-title').textContent.trim();
            const cardDes = this.querySelector('.card-title').getAttribute('data-des').trim();
            const rating = this.querySelector('.user-rating').textContent.trim();

            // Build a complete product object.
            const selectedProduct = {
                genre: selectedGenre,
                price: price,
                name: cardName,
                description: cardDes,
                rating: rating,
                image: imageLocation
            };

            // Save the selected product in localStorage.
            localStorage.setItem('selectedProduct', JSON.stringify(selectedProduct));

            // Collect similar items from all cards with the same genre.
            const matchingCards = document.querySelectorAll(`.card[data-genre="${this.getAttribute('data-genre')}"]`);
            let similarItems = [];

            matchingCards.forEach(cardItem => {
                const imgSrc = cardItem.getAttribute('data-image').trim();
                // Exclude the clicked product.
                if (imgSrc !== imageLocation) {
                    const nameText = cardItem.querySelector('.card-title').textContent.trim();
                    const ratingText = cardItem.querySelector('.user-rating').textContent.trim();
                    const priceText = cardItem.querySelector('.card-text').textContent.trim();
                    const descriptionText = cardItem.querySelector('.card-title').getAttribute('data-des').trim();
                    similarItems.push({
                        image: imgSrc,
                        name: nameText,
                        rating: ratingText,
                        genre: selectedGenre, // Save the genre for filtering later
                        price: priceText,
                        description: descriptionText
                    });
                }
            });

            // Save the similar items array in localStorage.
            localStorage.setItem('similarItems', JSON.stringify(similarItems));

            // Navigate to the product view page.
            window.location.href = this.getAttribute('href');
        });
    });

    /*---------------------------------------------------------
      Section 5: Search Functionality
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
