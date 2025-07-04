import { test, expect } from '@playwright/test';

test.describe('Device Management', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.addInitScript(() => {
      window.localStorage.setItem('supabase.auth.token', JSON.stringify({
        access_token: 'mock-token',
        expires_at: Date.now() + 3600000,
        user: {
          id: 'test-user',
          email: 'test@example.com'
        }
      }));
    });

    // Go to devices page
    await page.goto('/devices');
  });

  test('should display device list', async ({ page }) => {
    // Wait for devices to load
    await page.waitForSelector('[data-testid="device-card"]');

    // Check if devices are displayed
    const deviceCards = await page.locator('[data-testid="device-card"]').count();
    expect(deviceCards).toBeGreaterThan(0);

    // Check device information is visible
    await expect(page.locator('text=Living Room Switch')).toBeVisible();
    await expect(page.locator('text=Online')).toBeVisible();
  });

  test('should add new device', async ({ page }) => {
    // Click add device button
    await page.click('[data-testid="add-device-button"]');

    // Fill device form
    await page.fill('[data-testid="device-name-input"]', 'Kitchen Light');
    await page.selectOption('[data-testid="device-type-select"]', 'plus_2pm');
    await page.fill('[data-testid="device-ip-input"]', '192.168.1.200');
    await page.fill('[data-testid="device-mac-input"]', 'AA:BB:CC:DD:EE:FF');

    // Submit form
    await page.click('[data-testid="submit-device-button"]');

    // Wait for success message
    await expect(page.locator('text=Device added successfully')).toBeVisible();

    // Verify device appears in list
    await expect(page.locator('text=Kitchen Light')).toBeVisible();
  });

  test('should control device switch', async ({ page }) => {
    // Find a device with switch controls
    const deviceCard = page.locator('[data-testid="device-card"]').first();
    
    // Toggle switch
    const switchToggle = deviceCard.locator('[data-testid="switch-toggle"]').first();
    const initialState = await switchToggle.isChecked();
    
    await switchToggle.click();
    
    // Wait for state change
    await page.waitForTimeout(500);
    
    // Verify switch state changed
    expect(await switchToggle.isChecked()).toBe(!initialState);
  });

  test('should refresh device status', async ({ page }) => {
    const deviceCard = page.locator('[data-testid="device-card"]').first();
    
    // Click refresh button
    await deviceCard.locator('[data-testid="refresh-button"]').click();
    
    // Wait for loading indicator
    await expect(deviceCard.locator('[data-testid="loading-indicator"]')).toBeVisible();
    
    // Wait for loading to complete
    await expect(deviceCard.locator('[data-testid="loading-indicator"]')).not.toBeVisible();
    
    // Check last updated time changed
    await expect(deviceCard.locator('text=/Updated.*seconds? ago/')).toBeVisible();
  });

  test('should edit device details', async ({ page }) => {
    const deviceCard = page.locator('[data-testid="device-card"]').first();
    
    // Click edit button
    await deviceCard.locator('[data-testid="edit-device-button"]').click();
    
    // Update device name
    await page.fill('[data-testid="device-name-input"]', 'Updated Device Name');
    
    // Save changes
    await page.click('[data-testid="save-device-button"]');
    
    // Verify success message
    await expect(page.locator('text=Device updated successfully')).toBeVisible();
    
    // Verify name changed
    await expect(page.locator('text=Updated Device Name')).toBeVisible();
  });

  test('should delete device', async ({ page }) => {
    const deviceCard = page.locator('[data-testid="device-card"]').first();
    const deviceName = await deviceCard.locator('[data-testid="device-name"]').textContent();
    
    // Click delete button
    await deviceCard.locator('[data-testid="delete-device-button"]').click();
    
    // Confirm deletion
    await page.click('[data-testid="confirm-delete-button"]');
    
    // Wait for success message
    await expect(page.locator('text=Device deleted successfully')).toBeVisible();
    
    // Verify device removed from list
    await expect(page.locator(`text=${deviceName}`)).not.toBeVisible();
  });

  test('should filter devices by type', async ({ page }) => {
    // Select filter
    await page.selectOption('[data-testid="device-type-filter"]', 'plus_2pm');
    
    // Wait for filter to apply
    await page.waitForTimeout(500);
    
    // Verify only filtered devices shown
    const deviceCards = await page.locator('[data-testid="device-card"]').all();
    for (const card of deviceCards) {
      await expect(card.locator('text=2PM Switch')).toBeVisible();
    }
  });

  test('should search devices by name', async ({ page }) => {
    // Enter search term
    await page.fill('[data-testid="device-search-input"]', 'Living Room');
    
    // Wait for search to apply
    await page.waitForTimeout(500);
    
    // Verify search results
    const deviceCards = await page.locator('[data-testid="device-card"]').all();
    for (const card of deviceCards) {
      const deviceName = await card.locator('[data-testid="device-name"]').textContent();
      expect(deviceName?.toLowerCase()).toContain('living room');
    }
  });

  test('should handle offline devices', async ({ page }) => {
    // Find offline device
    const offlineDevice = page.locator('[data-testid="device-card"]:has-text("Offline")').first();
    
    if (await offlineDevice.count() > 0) {
      // Verify offline indicator
      await expect(offlineDevice.locator('[data-testid="offline-indicator"]')).toBeVisible();
      
      // Verify controls are disabled
      const switches = await offlineDevice.locator('[data-testid="switch-toggle"]').all();
      for (const switchToggle of switches) {
        await expect(switchToggle).toBeDisabled();
      }
    }
  });

  test('should show device details modal', async ({ page }) => {
    const deviceCard = page.locator('[data-testid="device-card"]').first();
    
    // Click device name to open details
    await deviceCard.locator('[data-testid="device-name"]').click();
    
    // Wait for modal
    await expect(page.locator('[data-testid="device-details-modal"]')).toBeVisible();
    
    // Verify details are shown
    await expect(page.locator('text=Device Information')).toBeVisible();
    await expect(page.locator('text=IP Address:')).toBeVisible();
    await expect(page.locator('text=MAC Address:')).toBeVisible();
    await expect(page.locator('text=Firmware Version:')).toBeVisible();
    
    // Close modal
    await page.click('[data-testid="close-modal-button"]');
    await expect(page.locator('[data-testid="device-details-modal"]')).not.toBeVisible();
  });
});