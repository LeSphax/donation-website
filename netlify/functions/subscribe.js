// Subscribe function - stores email in Google Sheets
// Uses Google Apps Script web app as a free webhook

exports.handler = async (event) => {
    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    try {
        const { email } = JSON.parse(event.body);

        if (!email || !isValidEmail(email)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Valid email is required' }),
            };
        }

        // Send to Google Sheets via Apps Script
        const googleScriptUrl = process.env.GOOGLE_SCRIPT_URL;
        
        if (googleScriptUrl) {
            try {
                await fetch(googleScriptUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        email,
                        timestamp: new Date().toISOString(),
                        source: 'avocado-secret'
                    }),
                });
            } catch (err) {
                // Log error but don't fail the request
                console.error('Failed to save to Google Sheets:', err);
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: 'Email saved successfully' }),
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to process subscription' }),
        };
    }
};

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
