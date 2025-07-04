import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing auth state
    await page.context().clearCookies();
    await page.evaluate(() => window.localStorage.clear());
  });

  test('should redirect unauthenticated users to login', async ({ page }) => {
    // Try to access protected route
    await page.goto('/devices');
    
    // Should be redirected to login
    await expect(page).toHaveURL(/\/auth\/signin/);
  });

  test('should sign in with valid credentials', async ({ page }) => {
    await page.goto('/auth/signin');
    
    // Fill login form
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    
    // Submit form
    await page.click('[data-testid="signin-button"]');
    
    // Wait for redirect
    await page.waitForURL(/\/devices/);
    
    // Verify logged in
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
    await expect(page.locator('text=test@example.com')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/auth/signin');
    
    // Fill login form with invalid credentials
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'wrongpassword');
    
    // Submit form
    await page.click('[data-testid="signin-button"]');
    
    // Wait for error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('text=Invalid login credentials')).toBeVisible();
    
    // Should stay on login page
    await expect(page).toHaveURL(/\/auth\/signin/);
  });

  test('should sign up new user', async ({ page }) => {
    await page.goto('/auth/signup');
    
    // Fill signup form
    await page.fill('[data-testid="name-input"]', 'New User');
    await page.fill('[data-testid="email-input"]', 'newuser@example.com');
    await page.fill('[data-testid="password-input"]', 'SecurePass123!');
    await page.fill('[data-testid="confirm-password-input"]', 'SecurePass123!');
    
    // Accept terms
    await page.check('[data-testid="terms-checkbox"]');
    
    // Submit form
    await page.click('[data-testid="signup-button"]');
    
    // Wait for success message
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    await expect(page.locator('text=verification email')).toBeVisible();
  });

  test('should validate signup form', async ({ page }) => {
    await page.goto('/auth/signup');
    
    // Try to submit empty form
    await page.click('[data-testid="signup-button"]');
    
    // Check validation messages
    await expect(page.locator('text=Name is required')).toBeVisible();
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
    
    // Test password mismatch
    await page.fill('[data-testid="password-input"]', 'Password123!');
    await page.fill('[data-testid="confirm-password-input"]', 'DifferentPassword123!');
    await page.click('[data-testid="signup-button"]');
    
    await expect(page.locator('text=Passwords do not match')).toBeVisible();
    
    // Test weak password
    await page.fill('[data-testid="password-input"]', 'weak');
    await page.fill('[data-testid="confirm-password-input"]', 'weak');
    await page.click('[data-testid="signup-button"]');
    
    await expect(page.locator('text=Password must be at least 8 characters')).toBeVisible();
  });

  test('should sign out user', async ({ page }) => {
    // Sign in first
    await page.goto('/auth/signin');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="signin-button"]');
    await page.waitForURL(/\/devices/);
    
    // Open user menu
    await page.click('[data-testid="user-menu"]');
    
    // Click sign out
    await page.click('[data-testid="signout-button"]');
    
    // Should redirect to login
    await expect(page).toHaveURL(/\/auth\/signin/);
    
    // Try to access protected route
    await page.goto('/devices');
    
    // Should redirect back to login
    await expect(page).toHaveURL(/\/auth\/signin/);
  });

  test('should persist session across page reloads', async ({ page }) => {
    // Sign in
    await page.goto('/auth/signin');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="signin-button"]');
    await page.waitForURL(/\/devices/);
    
    // Reload page
    await page.reload();
    
    // Should still be logged in
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
    await expect(page).toHaveURL(/\/devices/);
  });

  test('should handle password reset flow', async ({ page }) => {
    await page.goto('/auth/signin');
    
    // Click forgot password
    await page.click('[data-testid="forgot-password-link"]');
    
    // Should navigate to reset password page
    await expect(page).toHaveURL(/\/auth\/reset-password/);
    
    // Enter email
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.click('[data-testid="reset-password-button"]');
    
    // Should show success message
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    await expect(page.locator('text=password reset email')).toBeVisible();
  });

  test('should update password from account settings', async ({ page }) => {
    // Sign in first
    await page.goto('/auth/signin');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="signin-button"]');
    await page.waitForURL(/\/devices/);
    
    // Go to account settings
    await page.click('[data-testid="user-menu"]');
    await page.click('[data-testid="account-settings-link"]');
    
    // Navigate to security tab
    await page.click('[data-testid="security-tab"]');
    
    // Fill password update form
    await page.fill('[data-testid="current-password-input"]', 'password123');
    await page.fill('[data-testid="new-password-input"]', 'NewPassword123!');
    await page.fill('[data-testid="confirm-new-password-input"]', 'NewPassword123!');
    
    // Submit
    await page.click('[data-testid="update-password-button"]');
    
    // Should show success message
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    await expect(page.locator('text=Password updated successfully')).toBeVisible();
  });

  test('should handle OAuth sign in', async ({ page }) => {
    await page.goto('/auth/signin');
    
    // Click Google sign in
    await page.click('[data-testid="google-signin-button"]');
    
    // Would redirect to Google OAuth page in real scenario
    // For testing, we can mock the OAuth callback
    await page.goto('/auth/callback?code=mock-oauth-code');
    
    // Should process callback and redirect to devices
    await page.waitForURL(/\/devices/, { timeout: 10000 });
    
    // Verify logged in
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });
});