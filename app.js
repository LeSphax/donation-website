// Email form handling
const emailForm = document.getElementById('email-form');
const emailInput = document.getElementById('email');
const emailSuccess = document.getElementById('email-success');

emailForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = emailForm.querySelector('button[type="submit"]');
    const email = emailInput.value.trim();
    
    if (!email) return;
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('/.netlify/functions/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Redirect to the secret page
            window.location.href = '/secret.html';
        } else {
            throw new Error(data.error || 'Something went wrong');
        }
    } catch (error) {
        console.error('Error:', error);
        alert(error.message || 'Failed to subscribe. Please try again.');
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
});

// Donation handling
const donationBtns = document.querySelectorAll('.donate-btn');
const customAmountContainer = document.getElementById('custom-amount-container');
const customAmountInput = document.getElementById('custom-amount');
const customDonateBtn = document.getElementById('custom-donate-btn');

donationBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove selected state from all buttons
        donationBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        
        if (btn.dataset.custom) {
            // Show custom amount input
            customAmountContainer.hidden = false;
            customAmountInput.focus();
        } else {
            // Hide custom amount and proceed to checkout
            customAmountContainer.hidden = true;
            const amount = parseInt(btn.dataset.amount, 10);
            initiateCheckout(amount);
        }
    });
});

customDonateBtn.addEventListener('click', () => {
    const amount = parseFloat(customAmountInput.value);
    if (amount && amount >= 1) {
        initiateCheckout(Math.round(amount * 100)); // Convert to cents
    } else {
        customAmountInput.focus();
    }
});

customAmountInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        customDonateBtn.click();
    }
});

async function initiateCheckout(amountInCents) {
    try {
        const response = await fetch('/.netlify/functions/create-checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount: amountInCents }),
        });
        
        const data = await response.json();
        
        if (data.url) {
            // Redirect to Stripe Checkout
            window.location.href = data.url;
        } else {
            throw new Error(data.error || 'Failed to create checkout session');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to initiate checkout. Please try again.');
    }
}

