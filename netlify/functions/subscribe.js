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
        
        console.log('Google Script URL configured:', !!googleScriptUrl);
        
        if (googleScriptUrl) {
            const payload = { 
                email,
                timestamp: new Date().toISOString(),
                source: 'avocado-secret'
            };
            
            console.log('Sending to Google Sheets:', payload);
            
            // Google Apps Script needs redirect: 'follow' to work properly
            const response = await fetch(googleScriptUrl, {
                method: 'POST',
                redirect: 'follow',
                headers: { 
                    'Content-Type': 'text/plain',  // Apps Script handles this better
                },
                body: JSON.stringify(payload),
            });
            
            console.log('Google Sheets response status:', response.status);
            
            if (!response.ok) {
                console.error('Google Sheets error:', await response.text());
            }
        } else {
            console.warn('GOOGLE_SCRIPT_URL not configured');
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
