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
            subject: 'Welcome! Here\'s your free guide 🎁',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 32px;">
                        <h1 style="color: #ff6b35; margin-bottom: 8px;">Welcome! 🎉</h1>
                    </div>
                    
                    <p>Hey there!</p>
                    
                    <p>Thank you so much for joining! I'm thrilled to have you here.</p>
                    
                    <p>As promised, I've attached your free PDF guide to this email. I hope you find it valuable!</p>
                    
                    ${pdfBase64 ? '<p style="background: #f8f9fa; padding: 16px; border-radius: 8px; text-align: center;">📎 <strong>Your guide is attached to this email</strong></p>' : '<p style="background: #fff3cd; padding: 16px; border-radius: 8px; text-align: center;">⚠️ PDF attachment is being set up. You\'ll receive it soon!</p>'}
                    
                    <p>Stay tuned for more updates and exclusive content coming your way.</p>
                    
                    <p>Cheers,<br>
                    <strong>Your Name</strong></p>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
                    
                    <p style="font-size: 12px; color: #888; text-align: center;">
                        You received this email because you signed up on our website.<br>
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

