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

