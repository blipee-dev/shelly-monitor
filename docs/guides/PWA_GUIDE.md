# Progressive Web App (PWA) Guide

This guide covers the PWA features of Shelly Monitor, including installation, offline functionality, and push notifications.

## Features

### 1. **Installable App**
- Install Shelly Monitor directly to your device's home screen
- Works like a native app with full-screen experience
- Available on Android, iOS, and desktop browsers

### 2. **Offline Support**
- View cached device data when offline
- Queue device actions for sync when back online
- Automatic reconnection handling

### 3. **Push Notifications**
- Real-time alerts for device status changes
- Automation trigger notifications
- Energy threshold alerts
- Customizable notification preferences

### 4. **Mobile Optimization**
- Bottom navigation bar for easy thumb access
- Touch-optimized controls
- Responsive design for all screen sizes
- Native app-like performance

## Installation

### Android (Chrome)
1. Open Shelly Monitor in Chrome
2. Look for the "Install App" prompt or tap the menu (⋮)
3. Select "Add to Home screen"
4. Follow the prompts to install

### iOS (Safari)
1. Open Shelly Monitor in Safari
2. Tap the Share button (box with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Name the app and tap "Add"

### Desktop (Chrome/Edge)
1. Look for the install icon in the address bar
2. Click "Install" when prompted
3. The app will open in its own window

## Push Notifications

### Enabling Notifications
1. Go to Settings → Notifications
2. Toggle "Push Notifications" on
3. Accept the browser permission prompt
4. Customize notification types as needed

### Notification Types
- **Device Offline/Online**: Alert when devices lose or regain connection
- **Automation Triggered**: Notify when automations run
- **Energy Alerts**: Threshold-based consumption warnings
- **Security Alerts**: Important security notifications
- **Maintenance Reminders**: Device update notifications

## Offline Functionality

### What Works Offline
- View last known device states
- Access cached analytics data
- Browse automation configurations
- Read previous notifications

### Offline Actions
Device control actions are queued and synchronized when connection is restored using Background Sync API.

### Service Worker
The service worker handles:
- Asset caching for offline access
- Push notification delivery
- Background sync for queued actions
- Network request interception

## Mobile UI Features

### Bottom Navigation
On mobile devices, primary navigation moves to the bottom for easier access:
- Dashboard
- Devices
- Analytics
- Automations
- Settings

### Touch Gestures
- Swipe to dismiss notifications
- Pull to refresh on compatible browsers
- Long press for context menus

### Responsive Design
- Adaptive layouts for phones and tablets
- Optimized spacing for touch targets (44px minimum)
- Collapsible panels for space efficiency

## Technical Implementation

### Manifest Configuration
```json
{
  "name": "Shelly Monitor",
  "short_name": "Shelly Monitor",
  "display": "standalone",
  "orientation": "any",
  "theme_color": "#0061a4",
  "background_color": "#ffffff"
}
```

### Service Worker Caching Strategy
- **Static Assets**: Cache first, fallback to network
- **API Requests**: Network first, fallback to cache
- **Device Data**: Background sync for offline actions

### Push Notification Flow
1. User enables notifications in settings
2. Browser subscribes to push service
3. Subscription stored in database
4. Server sends notifications via Web Push API
5. Service worker displays notification

## Browser Support

### Full Support
- Chrome/Chromium (Android, Desktop)
- Edge (Android, Desktop)
- Samsung Internet
- Opera

### Partial Support
- Safari (iOS) - No push notifications
- Firefox - Limited PWA features

## Troubleshooting

### Installation Issues
- Clear browser cache and cookies
- Ensure HTTPS connection
- Check if PWA is already installed
- Verify manifest.json is accessible

### Notification Problems
- Check browser notification permissions
- Verify push subscription in settings
- Test with "Send Test Notification" button
- Check browser console for errors

### Offline Issues
- Verify service worker is registered
- Check cache storage in DevTools
- Clear cache if outdated content appears
- Ensure offline.html is cached

## Best Practices

1. **Install for Best Experience**: Installing the PWA provides the most native-like experience
2. **Enable Notifications**: Stay informed about device status and automations
3. **Regular Updates**: The app updates automatically when online
4. **Battery Optimization**: The PWA is optimized for minimal battery usage

## Security

- All data is encrypted in transit
- Push notifications use VAPID authentication
- No sensitive data stored in browser cache
- Secure HTTPS-only operation

## Development

### Testing PWA Features
```bash
# Build for production (required for service worker)
npm run build
npm run start

# Test on mobile device
# Use ngrok or similar for HTTPS tunnel
npx ngrok http 3000
```

### Debugging
- Chrome DevTools → Application tab
- Check Service Worker status
- Inspect Cache Storage
- Monitor Push subscriptions

### Key Files
- `/public/manifest.json` - PWA manifest
- `/public/sw.js` - Service worker
- `/src/lib/notifications/push-manager.ts` - Push notification logic
- `/src/components/pwa/InstallPrompt.tsx` - Install UI
- `/src/components/layout/MobileNavigation.tsx` - Mobile nav