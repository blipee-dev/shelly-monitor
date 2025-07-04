import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';
import { POST as signIn } from '@/app/api/auth/signin/route';
import { POST as signUp } from '@/app/api/auth/signup/route';
import { POST as signOut } from '@/app/api/auth/signout/route';
import { GET as getSession } from '@/app/api/auth/session/route';

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      getSession: jest.fn(),
      getUser: jest.fn()
    }
  }))
}));

describe('/api/auth', () => {
  let supabaseMock: any;

  beforeEach(() => {
    jest.clearAllMocks();
    supabaseMock = createClient('', '');
  });

  describe('POST /api/auth/signin', () => {
    it('should sign in user with valid credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockSession = {
        user: {
          id: 'user-123',
          email: 'test@example.com'
        },
        access_token: 'mock-token',
        refresh_token: 'mock-refresh-token'
      };

      supabaseMock.auth.signInWithPassword.mockResolvedValue({
        data: { session: mockSession, user: mockSession.user },
        error: null
      });

      const request = new NextRequest('http://localhost:3000/api/auth/signin', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });

      const response = await signIn(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.user).toEqual(mockSession.user);
      expect(supabaseMock.auth.signInWithPassword).toHaveBeenCalledWith(credentials);
    });

    it('should handle invalid credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      supabaseMock.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: 'Invalid login credentials' }
      });

      const request = new NextRequest('http://localhost:3000/api/auth/signin', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });

      const response = await signIn(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Invalid login credentials');
    });

    it('should validate email format', async () => {
      const credentials = {
        email: 'invalid-email',
        password: 'password123'
      };

      const request = new NextRequest('http://localhost:3000/api/auth/signin', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });

      const response = await signIn(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Invalid email format');
    });

    it('should validate required fields', async () => {
      const credentials = {
        email: 'test@example.com'
        // Missing password
      };

      const request = new NextRequest('http://localhost:3000/api/auth/signin', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });

      const response = await signIn(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Email and password are required');
    });
  });

  describe('POST /api/auth/signup', () => {
    it('should create new user account', async () => {
      const newUser = {
        email: 'newuser@example.com',
        password: 'SecurePass123!',
        name: 'New User'
      };

      const mockUser = {
        id: 'user-456',
        email: newUser.email,
        user_metadata: { name: newUser.name }
      };

      supabaseMock.auth.signUp.mockResolvedValue({
        data: { user: mockUser, session: null },
        error: null
      });

      const request = new NextRequest('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(newUser)
      });

      const response = await signUp(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.user).toEqual(mockUser);
      expect(data.message).toContain('verification email');
      expect(supabaseMock.auth.signUp).toHaveBeenCalledWith({
        email: newUser.email,
        password: newUser.password,
        options: {
          data: { name: newUser.name }
        }
      });
    });

    it('should handle duplicate email', async () => {
      const newUser = {
        email: 'existing@example.com',
        password: 'SecurePass123!',
        name: 'Existing User'
      };

      supabaseMock.auth.signUp.mockResolvedValue({
        data: null,
        error: { message: 'User already registered' }
      });

      const request = new NextRequest('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(newUser)
      });

      const response = await signUp(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('User already registered');
    });

    it('should validate password strength', async () => {
      const newUser = {
        email: 'newuser@example.com',
        password: 'weak',
        name: 'New User'
      };

      const request = new NextRequest('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(newUser)
      });

      const response = await signUp(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Password must be at least 8 characters');
    });
  });

  describe('POST /api/auth/signout', () => {
    it('should sign out authenticated user', async () => {
      supabaseMock.auth.signOut.mockResolvedValue({ error: null });

      const request = new NextRequest('http://localhost:3000/api/auth/signout', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer mock-token'
        }
      });

      const response = await signOut(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Signed out successfully');
      expect(supabaseMock.auth.signOut).toHaveBeenCalled();
    });

    it('should handle signout errors', async () => {
      supabaseMock.auth.signOut.mockResolvedValue({
        error: { message: 'Failed to sign out' }
      });

      const request = new NextRequest('http://localhost:3000/api/auth/signout', {
        method: 'POST'
      });

      const response = await signOut(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to sign out');
    });
  });

  describe('GET /api/auth/session', () => {
    it('should return current session for authenticated user', async () => {
      const mockSession = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          user_metadata: { name: 'Test User' }
        },
        access_token: 'mock-token',
        expires_at: Date.now() + 3600000
      };

      supabaseMock.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null
      });

      const request = new NextRequest('http://localhost:3000/api/auth/session', {
        headers: {
          'Authorization': 'Bearer mock-token'
        }
      });

      const response = await getSession(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.user).toEqual(mockSession.user);
      expect(data.expires_at).toBe(mockSession.expires_at);
    });

    it('should return null for unauthenticated request', async () => {
      supabaseMock.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null
      });

      const request = new NextRequest('http://localhost:3000/api/auth/session');
      const response = await getSession(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.user).toBeNull();
    });

    it('should handle session retrieval errors', async () => {
      supabaseMock.auth.getSession.mockResolvedValue({
        data: null,
        error: { message: 'Failed to get session' }
      });

      const request = new NextRequest('http://localhost:3000/api/auth/session');
      const response = await getSession(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to get session');
    });
  });
});