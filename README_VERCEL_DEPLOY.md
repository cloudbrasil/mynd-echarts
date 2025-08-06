# Vercel Deployment for Vitest UI

This project is configured to deploy the Vitest UI test interface to Vercel.

## Deployment Configuration

The Vercel deployment is configured through `vercel.json` with the following settings:

- **Build Command**: `npm run build:vitest-ui` - Builds the Vitest UI for deployment
- **Output Directory**: `dist-vitest-ui` - The built Vitest UI files
- **Framework**: None (custom build)

## Files Created

1. **vercel.json** - Main Vercel configuration file
2. **build-vitest-ui.js** - Custom build script to prepare Vitest UI for deployment
3. **package.json** - Added `build:vitest-ui` script

## How to Deploy

### Option 1: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally (if not already installed)
npm i -g vercel

# Deploy to Vercel
vercel

# For production deployment
vercel --prod
```

### Option 2: Deploy via GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Vercel will automatically detect the configuration and deploy

### Option 3: Manual Deploy

```bash
# Build the Vitest UI locally
npm run build:vitest-ui

# Deploy the dist-vitest-ui folder directly
vercel --prod dist-vitest-ui
```

## Features Included

- **SPA Routing**: Configured with rewrites for single-page application routing
- **Security Headers**: Added security headers (X-Frame-Options, X-Content-Type-Options, X-XSS-Protection)
- **Asset Caching**: Long-term caching for assets folder
- **Functions Support**: Ready for serverless functions if needed

## Environment Variables

No environment variables are required for the basic Vitest UI deployment.

## Post-Deployment

After deployment, your Vitest UI will be accessible at:
- Preview: `https://[project-name]-[hash].vercel.app`
- Production: `https://[project-name].vercel.app` (or your custom domain)

## Notes

- The Vitest UI will display test results from your local test runs
- Tests need to be run locally first to generate results
- The UI provides an interactive interface to view, filter, and debug tests