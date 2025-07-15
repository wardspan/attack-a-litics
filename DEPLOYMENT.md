# Attack-a-litics Deployment Guide

This guide provides step-by-step instructions for deploying Attack-a-litics to production using Railway (backend) and Vercel (frontend).

## Prerequisites

- [Railway CLI](https://docs.railway.app/cli/installation)
- [Vercel CLI](https://vercel.com/cli)
- [Node.js](https://nodejs.org/) (v18+)
- [Docker](https://www.docker.com/) (for local testing)

## Backend Deployment (Railway)

### 1. Prepare Backend for Production

1. **Environment Configuration**
   ```bash
   cd backend
   cp .env.example .env
   ```
   
   Edit `.env` with production values:
   ```env
   LOG_LEVEL=INFO
   CORS_ORIGINS=https://attack-a-litics.vercel.app,https://attack-a-litics-*.vercel.app
   ```

2. **Test Backend Locally**
   ```bash
   docker build -t attack-a-litics-backend .
   docker run -p 8000:8000 attack-a-litics-backend
   ```

### 2. Deploy to Railway

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Initialize Railway Project**
   ```bash
   cd backend
   railway init
   ```

4. **Deploy Backend**
   ```bash
   railway up
   ```

5. **Set Environment Variables**
   ```bash
   railway variables set LOG_LEVEL=INFO
   railway variables set CORS_ORIGINS=https://attack-a-litics.vercel.app,https://attack-a-litics-*.vercel.app
   ```

6. **Get Backend URL**
   ```bash
   railway status
   ```
   Note the URL (e.g., `https://attack-a-litics-backend.railway.app`)

### 3. Configure Custom Domain (Optional)

1. **Add Domain in Railway Dashboard**
   - Go to Railway dashboard
   - Select your project
   - Go to Settings > Domains
   - Add your custom domain

2. **Update DNS Settings**
   - Add CNAME record pointing to Railway's domain

## Frontend Deployment (Vercel)

### 1. Prepare Frontend for Production

1. **Update Environment Variables**
   ```bash
   cd frontend
   cp .env.example .env.local
   ```
   
   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_BACKEND_URL=https://attack-a-litics-backend.railway.app
   BACKEND_URL=https://attack-a-litics-backend.railway.app
   NEXT_TELEMETRY_DISABLED=1
   ```

2. **Test Frontend Locally**
   ```bash
   npm run build
   npm start
   ```

### 2. Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy Frontend**
   ```bash
   cd frontend
   vercel --prod
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add NEXT_PUBLIC_BACKEND_URL
   # Enter: https://attack-a-litics-backend.railway.app
   
   vercel env add BACKEND_URL
   # Enter: https://attack-a-litics-backend.railway.app
   
   vercel env add NEXT_TELEMETRY_DISABLED
   # Enter: 1
   ```

5. **Redeploy with Environment Variables**
   ```bash
   vercel --prod
   ```

### 3. Configure Custom Domain (Optional)

1. **Add Domain in Vercel Dashboard**
   - Go to Vercel dashboard
   - Select your project
   - Go to Settings > Domains
   - Add your custom domain

2. **Update DNS Settings**
   - Add CNAME record pointing to Vercel's domain

## Environment Variables Reference

### Backend Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `LOG_LEVEL` | Logging level | `INFO` | No |
| `CORS_ORIGINS` | Allowed CORS origins | `*` | Yes |

### Frontend Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_BACKEND_URL` | Backend API URL (client-side) | `http://localhost:8000` | Yes |
| `BACKEND_URL` | Backend API URL (server-side) | `http://localhost:8000` | Yes |
| `NEXT_TELEMETRY_DISABLED` | Disable Next.js telemetry | `1` | No |

## Post-Deployment Verification

### 1. Health Checks

1. **Backend Health**
   ```bash
   curl https://attack-a-litics-backend.railway.app/health
   ```
   Should return: `{"status": "healthy"}`

2. **Frontend Health**
   ```bash
   curl https://attack-a-litics.vercel.app/
   ```
   Should return the HTML page

### 2. Functionality Tests

1. **API Connectivity**
   - Visit your frontend URL
   - Check that backend status shows "healthy"
   - Try running a simulation

2. **Export Functionality**
   - Run a simulation
   - Test Excel export
   - Test CSV export
   - Test image export

3. **Mathematical Rendering**
   - Check that equations render properly
   - Verify KaTeX styles are loaded

## Performance Optimization

### 1. Frontend Optimizations

1. **Bundle Analysis**
   ```bash
   cd frontend
   npm install --save-dev @next/bundle-analyzer
   ANALYZE=true npm run build
   ```

2. **Image Optimization**
   - Use Next.js Image component
   - Enable WebP and AVIF formats
   - Configure image domains

3. **Code Splitting**
   - Plotly.js and KaTeX are automatically split
   - Use dynamic imports for heavy components

### 2. Backend Optimizations

1. **Caching**
   - Add Redis for simulation result caching
   - Cache static computation results

2. **Database Optimization**
   - Add database for storing simulation history
   - Optimize queries with indexes

## Monitoring and Logging

### 1. Application Monitoring

1. **Error Tracking**
   - Add Sentry for error monitoring
   - Configure error boundaries

2. **Performance Monitoring**
   - Add Web Vitals tracking
   - Monitor API response times

### 2. Infrastructure Monitoring

1. **Railway Monitoring**
   - Monitor CPU and memory usage
   - Set up alerts for downtime

2. **Vercel Monitoring**
   - Monitor build times
   - Track deployment success rate

## Scaling Considerations

### 1. Backend Scaling

1. **Vertical Scaling**
   - Increase Railway plan for more CPU/memory
   - Monitor resource usage

2. **Horizontal Scaling**
   - Add load balancer
   - Implement stateless architecture

### 2. Frontend Scaling

1. **Edge Caching**
   - Configure Vercel Edge Cache
   - Use CDN for static assets

2. **API Optimization**
   - Implement request caching
   - Use API route caching

## Security Considerations

### 1. CORS Configuration

```python
# backend/app/main.py
CORS_ORIGINS = [
    "https://attack-a-litics.vercel.app",
    "https://attack-a-litics-*.vercel.app"
]
```

### 2. Security Headers

```javascript
// frontend/next.config.js
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
      ],
    },
  ];
}
```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Verify `CORS_ORIGINS` environment variable
   - Check frontend URL is included in CORS origins

2. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed

3. **Runtime Errors**
   - Check browser console for JavaScript errors
   - Verify API endpoints are accessible

### Debug Commands

```bash
# Check Railway logs
railway logs

# Check Vercel logs
vercel logs

# Test API locally
curl -X POST https://attack-a-litics-backend.railway.app/simulate \
  -H "Content-Type: application/json" \
  -d '{"alpha": 0.1, "beta": 0.02, "gamma": 0.08, "delta": 0.015, "epsilon": 0.01, "eta": 0.025, "theta": 0.03, "lambda": 0.05, "mu": 0.02, "nu": 0.04, "xi": 0.03, "rho": 0.02, "sigma": 0.01, "x0": 100, "y0": 50, "z0": 30, "u0": 20, "time_span": 24, "resolution": 0.1, "solver_method": "RK45"}'
```

## Maintenance

### 1. Regular Updates

1. **Dependency Updates**
   ```bash
   npm update
   pip install --upgrade -r requirements.txt
   ```

2. **Security Updates**
   ```bash
   npm audit fix
   pip-audit --fix
   ```

### 2. Backup Strategy

1. **Configuration Backup**
   - Keep environment variables in secure storage
   - Document deployment procedures

2. **Data Backup**
   - Regular database backups (if added)
   - Export simulation templates

## Support

For deployment issues:
1. Check Railway documentation: https://docs.railway.app/
2. Check Vercel documentation: https://vercel.com/docs
3. Review application logs for error details
4. Test locally with production environment variables

## Next Steps

After successful deployment, consider:
1. Setting up monitoring and alerting
2. Implementing user authentication
3. Adding database persistence
4. Enhancing mobile experience
5. Adding more educational content