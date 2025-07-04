# Device Management Guide

## Overview

This guide covers how to manage Shelly devices in the monitoring platform, including adding devices, controlling them, and organizing them into groups.

## Supported Devices

### Power Control Devices
- **Shelly Plus 2PM**: 2-channel relay with power monitoring
- **Shelly Plus 1PM**: 1-channel relay with power monitoring
- **Shelly Dimmer 2**: Light dimmer with power monitoring

### Sensor Devices
- **Shelly Motion 2**: WiFi motion sensor with light and temperature
- **Shelly BLU Motion**: Bluetooth motion sensor with humidity

## Adding a Device

### Prerequisites
- Device must be connected to your network
- You need the device's IP address
- Device must have HTTP API enabled

### Steps

1. Navigate to **Devices** in the sidebar
2. Click **Add Device** button
3. Fill in the device information:
   - **Device Type**: Select from dropdown
   - **Name**: Give it a meaningful name
   - **IP Address**: Enter device IP (e.g., 192.168.1.100)
   - **MAC Address**: Will auto-fill if connection test succeeds
   - **Location**: Optional description (e.g., "Living Room")
   - **Group**: Optional organization

4. Click **Test Connection** to verify:
   - Green message = Device found and accessible
   - Red message = Check IP and device status

5. Click **Add Device** to save

## Controlling Devices

### Relay Devices (Plus 1PM/2PM)

1. Go to device details page
2. Use the toggle switch to turn on/off
3. Monitor real-time power usage
4. View energy consumption over time

**Power Monitoring Shows:**
- Current power (Watts)
- Total energy (kWh)
- Voltage and current
- Temperature

### Dimmer Devices

1. Go to device details page
2. Toggle on/off with switch
3. Adjust brightness with slider (0-100%)
4. Changes apply immediately

### Motion Sensors

Motion sensors are read-only and display:
- Motion detection status
- Light level (lux)
- Temperature
- Battery level
- Humidity (BLU Motion only)

## Device Groups

### Creating Groups

1. In Devices page, find **Device Groups** panel
2. Click **New Group**
3. Enter group name and description
4. Click **Create**

### Assigning Devices to Groups

1. Edit a device
2. Select group from dropdown
3. Save changes

### Benefits of Groups
- Organize devices by location or function
- Filter device list by group
- Future: Bulk operations on groups

## Real-time Updates

The platform automatically updates:
- Device online/offline status
- Power consumption data
- Sensor readings
- Control states

No need to refresh - changes appear instantly!

## Device Details Page

### Overview Tab
- Device information (IP, MAC, location)
- Control interfaces
- Current status and readings

### Analytics Tab
- Historical charts for:
  - Power usage (relay/dimmer devices)
  - Environmental data (sensors)
  - Battery levels

### Settings Tab
- Advanced device configuration (coming soon)

## Troubleshooting

### Device Shows Offline
1. Check device power and network connection
2. Verify IP address hasn't changed
3. Ensure device firmware is up to date
4. Try **Refresh** button on device page

### Cannot Control Device
1. Verify device is online
2. Check HTTP API is enabled on device
3. Ensure no other app is controlling it
4. Check device isn't in a locked state

### Connection Test Fails
1. Verify IP address is correct
2. Check device and monitoring system are on same network
3. Ensure no firewall blocking connection
4. Try accessing http://[device-ip]/status in browser

## Best Practices

1. **Naming Convention**: Use descriptive names like "Kitchen Light" or "Bedroom Switch"
2. **Groups**: Organize by room or function
3. **IP Addresses**: Consider setting static IPs for devices
4. **Regular Checks**: Monitor device temperatures and power consumption
5. **Firmware**: Keep device firmware updated

## API Endpoints

Devices communicate via HTTP API:

### Status Check
```
GET http://[device-ip]/status
```

### Relay Control
```
POST http://[device-ip]/relay/[0|1]?turn=[on|off]
```

### Dimmer Control
```
POST http://[device-ip]/light/0?turn=[on|off]&brightness=[0-100]
```

## Security Notes

- Devices should be on a secure network
- Consider using VLANs for IoT devices
- Regular firmware updates are important
- Monitor for unusual behavior

## Advanced Features (Coming Soon)

- Automation rules
- Scheduled controls
- Energy usage reports
- Device backup/restore
- Bulk operations