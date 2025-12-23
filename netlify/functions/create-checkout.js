// Create Stripe Checkout Session for donations
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    try {
        const { amount } = JSON.parse(event.body);

        // Validate amount (minimum $1, maximum $999)
        if (!amount || amount < 100 || amount > 99900) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Invalid amount. Must be between $1 and $999.' }),
            };
        }

        // Get the site URL for redirects
        const siteUrl = process.env.URL || 'http://localhost:8888';

        // Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            submit_type: 'donate',
            billing_address_collection: 'auto',
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Donation',
                            description: 'Thank you for your generous support! 💝',
                        },
                        unit_amount: amount,
                    },
                    quantity: 1,
                },
            ],
            success_url: `${siteUrl}/success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${siteUrl}/?cancelled=true`,
        });

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: session.url }),
        };

    } catch (error) {
        console.error('Stripe error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Failed to create checkout session' }),
        };
    }
};

