# 🥑 The 20-Day Avocado Secret

A landing page that reveals the secret to making avocados last 20 days. Collects emails via Google Sheets and accepts donations via Stripe.

## Features

- 🥑 Beautiful avocado-themed landing page
- 📧 Email capture → stores in Google Sheets (free!)
- 🔓 Secret reveal page after email submission
- 💳 Stripe donations ($1, $5, $10, or custom)
- ⚡ Serverless (Netlify Functions)

## Setup

### 1. Deploy to Netlify

Connect your GitHub repo to Netlify, or:

```bash
npm install
npx netlify login
npx netlify init
npx netlify deploy --prod
```

### 2. Set Up Google Sheets (Free Email Storage)

This is the easiest way to collect emails — no API keys needed!

#### Step 1: Create a Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new spreadsheet
2. Name it "Avocado Emails" (or whatever you like)
3. Add headers in row 1: `Email`, `Timestamp`, `Source`

#### Step 2: Create the Apps Script

1. In your Google Sheet, go to **Extensions → Apps Script**
2. Delete any existing code and paste this:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      data.email,
      data.timestamp || new Date().toISOString(),
      data.source || 'website'
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Click **Save** (💾)

#### Step 3: Deploy as Web App

1. Click **Deploy → New deployment**
2. Click the gear icon ⚙️ → Select **Web app**
3. Set:
   - **Description**: "Email collector"
   - **Execute as**: "Me"
   - **Who has access**: "Anyone"
4. Click **Deploy**
5. Click **Authorize access** and allow permissions
6. **Copy the Web App URL** (looks like `https://script.google.com/macros/s/ABC.../exec`)

#### Step 4: Add to Netlify

1. Go to your Netlify site → **Site Settings → Environment Variables**
2. Add: `GOOGLE_SCRIPT_URL` = your Web App URL

That's it! Emails will now appear in your Google Sheet automatically.

### 3. Set Up Stripe (Optional - for donations)

1. Create a [Stripe account](https://dashboard.stripe.com/register)
2. Get your Secret Key from [API Keys](https://dashboard.stripe.com/apikeys)
3. Add to Netlify environment variables:
   - `STRIPE_SECRET_KEY` = your secret key (starts with `sk_`)

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_SCRIPT_URL` | Yes | Google Apps Script web app URL |
| `STRIPE_SECRET_KEY` | For donations | Stripe secret key |

## Local Development

```bash
# Create .env file with your variables
echo "GOOGLE_SCRIPT_URL=your-url-here" > .env

# Install and run
npm install
npm run dev
```

Visit `http://localhost:8888`

## File Structure

```
├── index.html          # Landing page
├── secret.html         # The avocado secret (shown after email)
├── success.html        # Donation thank you page
├── styles.css          # Styles
├── app.js              # Frontend JS
└── netlify/functions/
    ├── subscribe.js    # Email → Google Sheets
    └── create-checkout.js  # Stripe checkout
```

## License

MIT
