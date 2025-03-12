

document.addEventListener('DOMContentLoaded', () => {
    function updateTotals() {
        let overallTotal = 0;
        
        /**
         * Function to calculate the total price of the items in the cart
         * This will also calculate the discount process
         * 
         */
        document.querySelectorAll('.cart-item').forEach(item => {
            const price = parseFloat(item.querySelector('.price').textContent.replace('$', ''));
            const discountInput = item.querySelector('input[type="number"]');
            let discount = parseInt(discountInput.value);
            
            //Sets the discount limit to 30%
            discount = Math.min(Math.max(discount, 1), 30);
            discountInput.value = discount;

            //Calculates the discounted price
            const discountedPrice = price * (1 - discount / 100);
            const totalInput = item.querySelector('input[type="text"]');
            totalInput.value = `$${discountedPrice.toFixed(2)}`;
            
            //will add all the discounted price in the cart
            overallTotal += discountedPrice;
        });

        document.getElementById('total-amount').textContent = `$${overallTotal.toFixed(2)}`;
    }


    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('input', updateTotals);
    });


    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    const cardInfo = document.getElementById('card-info');
    
    /**
     * This function checks the payment option of the user
     * If the option is card it will show the card info form
     * otherwise hide it.
     * The default option is cash on delivery
     */ 
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            cardInfo.style.display = radio.value === 'card' ? 'block' : 'none';
        });
    });

   
    updateTotals();
    //remove an item in the cart
    document.querySelectorAll('.close').forEach(button => {
        button.addEventListener('click', (e) => {
            e.target.closest('.cart-item').remove();
            updateTotals();
        });
    });
});


