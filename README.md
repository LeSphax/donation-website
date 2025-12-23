# Donation Website

A beautiful, minimal-cost donation website with email capture and PDF delivery.

## Features

- 🎨 Beautiful, modern dark theme design
- 📧 Email capture with automatic PDF delivery
- 💳 Stripe integration for donations ($5, $10, $25, or custom)
- ⚡ Serverless architecture (Netlify Functions)
- 📱 Fully responsive

## Cost Breakdown

| Service | Free Tier | Notes |
|---------|-----------|-------|
| **Netlify** | 100GB bandwidth, 125k function calls/month | Hosting + Functions |
| **Resend** | 100 emails/day, 3,000/month | Email delivery |
| **Stripe** | 2.9% + $0.30 per transaction | Payment processing |

**Total monthly cost: $0** (until you exceed free tiers or receive donations)

## Quick Deploy

### 1. Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

Or manually:

```bash
# Install dependencies
npm install

# Login to Netlify
npx netlify login

# Create new site
npx netlify init

# Deploy
npx netlify deploy --prod
```

### 2. Set Up Stripe

1. Create a [Stripe account](https://dashboard.stripe.com/register)
2. Get your **Secret Key** from [API Keys](https://dashboard.stripe.com/apikeys)
3. Add it to Netlify environment variables:
   - Go to Site Settings → Environment Variables
   - Add `STRIPE_SECRET_KEY` with your secret key

### 3. Set Up Resend (Email)

1. Create a [Resend account](https://resend.com/signup)
2. Get your API key from [API Keys](https://resend.com/api-keys)
3. Add to Netlify environment variables:
   - `RESEND_API_KEY` - your Resend API key
   - `FROM_EMAIL` - `onboarding@resend.dev` (for testing) or your verified domain

### 4. Add Your PDF

#### Option A: Base64 (for small PDFs < 1MB)

```bash
# Encode your PDF
cat your-guide.pdf | base64 | pbcopy  # macOS - copies to clipboard

# Add to Netlify env vars as PDF_BASE64
```

#### Option B: URL (for larger PDFs)

Host your PDF on a CDN and modify `subscribe.js` to download and attach it.

## Local Development

```bash
# Copy environment file
cp .env.example .env

# Fill in your API keys in .env

# Install dependencies
npm install

# Start local dev server
npm run dev
```

Visit `http://localhost:8888`

## Customization

### Branding

Edit `index.html`:
- Change the title and descriptions
- Update the hero text
- Modify footer links

Edit `styles.css`:
- Change `--color-accent` for different accent color
- Modify fonts in `:root`

### Email Template

Edit `netlify/functions/subscribe.js`:
- Customize the HTML email template
- Change the subject line
- Add your name/brand

### Donation Amounts

Edit `index.html`:
- Modify the `data-amount` attributes (in cents)
- Change emoji and labels

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `STRIPE_SECRET_KEY` | Yes | Stripe secret key |
| `RESEND_API_KEY` | Yes | Resend API key |
| `FROM_EMAIL` | No | Sender email (default: onboarding@resend.dev) |
| `PDF_BASE64` | No | Base64 encoded PDF for attachment |

## File Structure

```
donation-website/
├── index.html          # Main landing page
├── success.html        # Payment success page
├── styles.css          # All styles
├── app.js              # Frontend JavaScript
├── netlify.toml        # Netlify configuration
├── package.json        # Dependencies
└── netlify/
    └── functions/
        ├── subscribe.js      # Email capture function
        └── create-checkout.js # Stripe checkout function
```

## Troubleshooting

### Emails not sending

1. Check Resend dashboard for errors
2. Verify `RESEND_API_KEY` is set correctly
3. Check function logs in Netlify

### Stripe checkout fails

1. Verify `STRIPE_SECRET_KEY` is set
2. Check that you're using the correct key (test vs live)
3. Review function logs for errors

### PDF not attaching

1. Ensure `PDF_BASE64` is properly encoded
2. Check that PDF size is under 10MB
3. Verify base64 encoding is correct

## Going Live

1. Switch Stripe from test to live keys
2. Verify a domain in Resend (for professional emails)
3. Update `FROM_EMAIL` to your verified domain
4. Test everything end-to-end

## License

MIT

