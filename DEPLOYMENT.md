# Deployment Guide for mynd-echarts Demo

## Vercel Deployment

The demo application is configured for easy deployment to Vercel.

### Prerequisites
- Vercel CLI installed (`npm i -g vercel`)
- Vercel account

### Configuration Files
- `vercel.json` - Contains all deployment settings
- `dist-demo/` - Output directory for the demo build

### Deploy to Vercel

#### Option 1: Deploy via CLI

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

#### Option 2: Connect to GitHub

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Vercel will automatically detect the configuration
5. Click "Deploy"

### Build Configuration

The `vercel.json` file configures:
- **Build Command**: `DEMO_BUILD=true npm run build:demo`
- **Output Directory**: `dist-demo`
- **Framework**: None (custom Vite build)
- **Rewrites**: SPA routing to handle client-side navigation
- **Headers**: Security headers and caching for assets

### Features

- ✅ Automatic builds on push
- ✅ Preview deployments for PRs
- ✅ Optimized chunk splitting for better performance
- ✅ Security headers (X-Frame-Options, CSP, etc.)
- ✅ Long-term caching for assets
- ✅ SPA routing support

### Environment Variables

No additional environment variables are required. The `DEMO_BUILD=true` flag is set automatically in the build command.

### Build Output

The demo build creates optimized chunks:
- `echarts-core` - Core ECharts functionality
- `echarts-charts` - Chart types
- `echarts-components` - UI components
- `vendor` - Vue framework
- `main` - Application code

### Troubleshooting

If the build fails on Vercel:

1. **Check build logs**: Look for any missing dependencies
2. **Verify Node version**: Ensure Node 18+ is being used
3. **Clear cache**: In Vercel dashboard, redeploy with "Clear Build Cache"
4. **Test locally**: Run `npm run build:demo` locally to verify

### Custom Domain

To add a custom domain:
1. Go to your project in Vercel dashboard
2. Navigate to Settings → Domains
3. Add your domain and follow DNS configuration instructions

### Performance

The demo is optimized with:
- Code splitting for parallel loading
- Gzip compression
- Browser caching headers
- Lazy loading of chart components