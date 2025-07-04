# Progressive Web App (PWA) Guide

This guide covers the PWA features of Shelly Monitor, including installation, offline functionality, push notifications, and AI-powered predictive notifications.

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
- Natural language notification creation
- Scheduled and recurring notifications
- AI-powered predictive notifications

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
- **Predictive Alerts**: AI-generated based on behavior patterns
- **Anomaly Detection**: Unusual activity notifications
- **Custom Notifications**: Created via natural language with Ask Blipee

## AI-Powered Predictive Notifications

### Natural Language Notification Creation
Ask Blipee can create custom notifications using natural language:
- "Send me a notification saying the laundry is done"
- "Remind me to check the lights in 30 minutes"
- "Alert me every morning at 8 AM to check devices"
- "Schedule a notification for tomorrow at 3 PM"

### Predictive Notifications
The AI analyzes your usage patterns to suggest relevant notifications:

#### Pattern Detection
- Identifies regular device usage (e.g., lights always on at 6 PM)
- Suggests automations based on consistent behaviors
- Confidence scores for each prediction (0-100%)

#### Anomaly Detection
- Detects unusual activity (e.g., 3 AM device usage)
- Identifies inactive devices (not used for 7+ days)
- Security-focused alerts for suspicious patterns

#### Energy Optimization
- Detects devices frequently left on for extended periods
- Suggests auto-off timers for energy savings
- Calculates potential cost savings

#### Behavioral Predictions
- Suggests automations based on device combinations
- Predicts maintenance needs based on device age
- Recommends notifications based on your setup

### Using Predictive Features
1. **Analyze Patterns**: "What patterns have you noticed in my usage?"
2. **Get Suggestions**: "What predictive notifications do you recommend?"
3. **Focus Areas**: "Show me energy-saving opportunities"
4. **Auto-Enable**: "Enable the top 3 suggested notifications"
5. **Check Anomalies**: "Detect any unusual activity"

### Examples of Predictive Notifications
- "Your living room lights are always on at 6:00 PM (95% confidence). Create automation?"
- "Kitchen motion sensor detected activity at 3:47 AM. Enable nighttime alerts?"
- "Heater left on for 6+ hours regularly. Set 4-hour auto-off timer?"
- "Device 'Garage Light' hasn't been used in 12 days. Still needed?"

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