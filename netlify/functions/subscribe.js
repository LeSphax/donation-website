// Subscribe function - sends welcome email with PDF attachment
// Uses Resend for email delivery (100 emails/day free)

const { Resend } = require('resend');

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

        // Initialize Resend
        const resend = new Resend(process.env.RESEND_API_KEY);

        // Read the PDF file (base64 encoded)
        // You'll need to add your PDF to the public folder and encode it
        // Or store it as base64 in an environment variable for small PDFs
        const pdfBase64 = process.env.PDF_BASE64 || null;

        // Prepare attachments
        const attachments = pdfBase64 ? [
            {
                filename: 'welcome-guide.pdf',
                content: pdfBase64,
            },
        ] : [];

        // Send welcome email
        await resend.emails.send({
            from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
            to: email,
            subject: '🥑 Your 20-Day Avocado Secret is Here!',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fdf9;">
                    <div style="text-align: center; margin-bottom: 32px;">
                        <div style="font-size: 48px; margin-bottom: 16px;">🥑</div>
                        <h1 style="color: #5a9c2e; margin-bottom: 8px;">The Secret is Yours!</h1>
                    </div>
                    
                    <p>Hey there, fellow avocado lover!</p>
                    
                    <p>You're about to save a LOT of avocados (and money). No more brown, mushy disappointments!</p>
                    
                    <p>Here's your complete guide to making avocados last <strong>20 days instead of 5</strong>:</p>
                    
                    ${pdfBase64 ? '<p style="background: #e8f5e9; padding: 16px; border-radius: 8px; text-align: center; border: 1px solid #c8e6c9;">📎 <strong>Your guide is attached to this email!</strong></p>' : '<div style="background: #e8f5e9; padding: 24px; border-radius: 12px; margin: 24px 0; border: 1px solid #c8e6c9;"><h3 style="color: #2e7d32; margin: 0 0 12px 0;">The Quick Method:</h3><ol style="margin: 0; padding-left: 20px;"><li style="margin-bottom: 8px;">Keep unripe avocados at room temperature until slightly soft</li><li style="margin-bottom: 8px;">Once ripe, place them in the refrigerator</li><li style="margin-bottom: 8px;">Store in a paper bag with an apple to control ethylene</li><li style="margin-bottom: 8px;">For cut avocados: keep the pit in, add lemon juice, wrap tightly</li></ol></div>'}
                    
                    <p>Pro tip: Buy avocados at different ripeness levels and rotate them into the fridge as they ripen. You'll always have a perfect one ready!</p>
                    
                    <p>Happy saving! 🥑</p>
                    
                    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 32px 0;">
                    
                    <p style="font-size: 12px; color: #888; text-align: center;">
                        You received this because you wanted the avocado secret.<br>
                        <a href="#" style="color: #888;">Unsubscribe</a>
                    </p>
                </body>
                </html>
            `,
            attachments,
        });

        // Optional: Store email in a database or spreadsheet
        // You could integrate with Airtable, Google Sheets, or a simple JSON file

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: 'Email sent successfully' }),
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

