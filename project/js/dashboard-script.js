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
