# Troubleshooting Guide

## MIME Type Errors

If you see errors like:
- "Refused to apply style... because its MIME type ('text/html') is not a supported stylesheet MIME type"
- "Refused to execute script... because its MIME type ('text/html') is not executable"

### Solution:

1. **Clear all caches:**
   ```bash
   ./scripts/clear-cache.sh
   ```

2. **Clear browser cache:**
   - Open Chrome DevTools (F12)
   - Go to Application tab
   - Click "Clear site data" under Storage
   - OR use Incognito/Private mode

3. **Unregister service worker (if needed):**
   - Open Chrome DevTools
   - Go to Application tab
   - Click "Service Workers" 
   - Click "Unregister" for any workers
   - Refresh the page

4. **Restart the dev server:**
   ```bash
   # Kill all Next.js processes
   pkill -f "next dev"
   
   # Start fresh
   npm run dev
   ```

5. **If issues persist:**
   ```bash
   # Complete reset
   rm -rf node_modules .next
   npm install
   npm run dev
   ```

## Common Issues

### Port Already in Use
If you get "Port 3000 is already in use":
```bash
# Find and kill the process
lsof -i :3000
kill -9 <PID>

# Or use a different port
PORT=3001 npm run dev
```

### Grid Component Warnings
All Grid components have been updated to Material-UI v5.5+ syntax. If you still see warnings, ensure you're using:
```jsx
// ✅ Correct
<Grid size={{ xs: 12, md: 6 }}>

// ❌ Deprecated
<Grid item xs={12} md={6}>
```

### 404 on /alerts Route
The alerts page has been created. If you still get 404:
1. Restart the dev server
2. Clear Next.js cache: `rm -rf .next`

### PWA Icon Errors
If you see "Resource size is not correct":
- Placeholder icons have been generated
- Replace with proper icons for production
- Icons should be actual size (not 1x1 pixels)