#!/bin/bash

echo "Clearing all caches..."

# Kill any running Next.js processes
echo "Stopping Next.js processes..."
pkill -f "next dev" || true
pkill -f "next start" || true

# Clear Next.js cache
echo "Clearing Next.js cache..."
rm -rf .next

# Clear node_modules cache
echo "Clearing node_modules cache..."
rm -rf node_modules/.cache

# Clear any other caches
echo "Clearing other caches..."
rm -rf .swc
rm -rf .turbo

echo "All caches cleared!"
echo ""
echo "To start fresh:"
echo "1. Close all browser tabs with the application"
echo "2. Clear browser cache (or open in incognito/private mode)"
echo "3. Run: npm run dev"
echo ""
echo "If issues persist, try:"
echo "rm -rf node_modules && npm install"