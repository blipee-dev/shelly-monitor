# AI Features Guide - Ask Blipee

This guide covers all AI-powered features in Shelly Monitor, focusing on the Ask Blipee assistant and its capabilities.

## Overview

Ask Blipee is an intelligent AI assistant that helps you control devices, create automations, send notifications, and analyze your smart home usage patterns using natural language.

## Core Capabilities

### 1. **Device Control**
Control any device with natural language:
- "Turn off all lights"
- "Dim the living room to 50%"
- "What's the status of my devices?"
- "Turn on the heater for 2 hours"

### 2. **Automation Management**
Create and manage automations conversationally:
- "Turn off all lights at 10 PM every day"
- "When motion is detected, turn on hallway lights"
- "Create a morning routine that turns on kitchen lights at 7 AM"
- "Disable the bedtime automation"
- "Show me all my automations"

### 3. **Scene Control**
Create and activate scenes:
- "Create a movie night scene that dims all lights"
- "Activate bedtime mode"
- "Create an away mode that turns everything off"
- "What scenes do I have?"

### 4. **Energy Analytics**
Get insights about energy usage:
- "What's my current power consumption?"
- "How much energy did I use today?"
- "Which device uses the most power?"
- "Show me energy saving tips"

## Advanced AI Features

### 5. **Natural Language Notifications**

#### Send Custom Notifications
- "Send me a notification saying dinner is ready"
- "Alert me that the laundry is done"
- "Notify me to take out the trash"

#### Schedule Notifications
- "Remind me to check the garage in 30 minutes"
- "Alert me tomorrow at 3 PM to water the plants"
- "Remind me every Monday to check device firmware"
- "Schedule a daily 9 PM reminder to turn off lights"

#### Notification Management
- "Enable push notifications"
- "Disable email alerts"
- "Test my notifications"
- "What's my notification status?"

### 6. **Predictive Notifications**

The AI analyzes your usage patterns to provide intelligent suggestions:

#### Pattern Detection
- Identifies regular behaviors (lights on at specific times)
- Suggests automations based on consistent patterns
- Provides confidence scores for predictions

#### Anomaly Detection
- Detects unusual activity (3 AM device usage)
- Identifies inactive devices
- Security-focused alerts

#### Energy Optimization
- Finds devices frequently left on
- Suggests auto-off timers
- Calculates potential savings

#### Usage Examples
- "Analyze my usage patterns"
- "What predictive notifications do you suggest?"
- "Show me energy-saving opportunities"
- "Detect any unusual activity"
- "What patterns have you noticed?"
- "Enable the top 3 suggested notifications"

### 7. **Smart Suggestions**

Based on your device setup, Ask Blipee suggests:
- Automations (motion sensor + lights = motion automation)
- Notifications (high energy usage alerts)
- Scenes (common device groupings)
- Maintenance (firmware update reminders)

## Conversation Examples

### Basic Control
```
You: Turn off the living room lights
Blipee: ✓ Turned off Living Room Light

You: What's my energy usage?
Blipee: Current power consumption is 450W, estimated daily cost: €1.62
```

### Creating Automations
```
You: Create an automation to turn off all lights at bedtime
Blipee: Created automation "Bedtime Lights Off" that will turn off all lights daily at 10:00 PM

You: When someone enters the hallway, turn on the lights
Blipee: Created automation "Hallway Motion Lights" that turns on Hallway Light when motion is detected
```

### Predictive Features
```
You: Analyze my usage patterns
Blipee: Found 4 predictive notification opportunities:
1. Living Room Light always on at 6:00 PM (95% confidence) - Create automation?
2. Kitchen Light left on for 6+ hours regularly - Set auto-off timer?
3. Unusual activity at 3:47 AM last Tuesday - Enable security alerts?
4. Garage Light hasn't been used in 12 days - Still needed?

You: Enable the first two suggestions
Blipee: ✓ Created daily automation for Living Room Light at 6:00 PM
✓ Set 4-hour auto-off timer for Kitchen Light
```

### Custom Notifications
```
You: Send me a notification in 2 hours to check the oven
Blipee: ✓ Notification scheduled for 3:45 PM: "Check the oven"

You: Remind me every morning at 8 AM to check device status
Blipee: ✓ Created recurring daily notification at 8:00 AM: "Check device status"
```

## Technical Details

### AI Providers
- **Primary**: DeepSeek (cost-optimized)
- **Fallback**: OpenAI, Anthropic
- **Features**: Streaming responses, function calling

### Function Capabilities
The AI can execute these functions:
- `control_device` - Turn devices on/off, adjust settings
- `create_automation` - Parse natural language into automations
- `manage_automation` - Enable/disable/delete automations
- `create_scene` - Create multi-device scenes
- `activate_scene` - Run saved scenes
- `send_notification` - Send instant notifications
- `schedule_notification` - Schedule future notifications
- `analyze_predictive_notifications` - Analyze usage patterns
- `manage_notifications` - Configure notification settings
- `install_app` - Guide PWA installation
- `check_pwa_status` - Check app and notification status

### Pattern Analysis
The predictive engine analyzes:
- 30 days of historical data
- Device usage frequencies
- Time-based patterns
- Energy consumption trends
- Anomaly detection algorithms
- Behavioral correlations

### Confidence Scoring
Predictions include confidence scores:
- **90-100%**: Very likely pattern
- **70-89%**: Probable pattern
- **50-69%**: Possible pattern
- **Below 50%**: Not suggested

## Best Practices

1. **Be Specific**: "Turn off bedroom lights" vs "Turn off lights"
2. **Use Natural Language**: Speak naturally, the AI understands context
3. **Check Suggestions**: Regularly ask for predictive notifications
4. **Enable Patterns**: Let the AI learn from your behavior
5. **Review Anomalies**: Check unusual activity alerts for security

## Privacy & Security

- All analysis happens locally in your account
- No usage data is shared with third parties
- Predictions are based only on your own patterns
- You control all notification preferences
- AI suggestions are optional and can be ignored

## Troubleshooting

### AI Not Responding
- Check internet connection
- Verify AI API keys are configured
- Try refreshing the page

### Predictions Not Accurate
- Allow 7+ days of usage for pattern detection
- Ensure devices are logging telemetry
- Check that automations aren't interfering

### Notifications Not Working
- Verify push notifications are enabled
- Check browser permissions
- Test with "Send test notification"

## Future Enhancements

Planned AI improvements:
- Voice control integration
- Multi-user pattern learning
- Weather-based predictions
- Energy cost optimization
- Predictive maintenance alerts