import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';
import { GET, POST, PUT, DELETE } from '@/app/api/devices/route';
import { GET as GET_SINGLE } from '@/app/api/devices/[id]/route';

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      eq: jest.fn(),
      single: jest.fn()
    })),
    auth: {
      getUser: jest.fn()
    }
  }))
}));

// Mock middleware authentication
jest.mock('@/lib/auth/middleware', () => ({
  verifyAuth: jest.fn().mockResolvedValue({ userId: 'test-user-id' })
}));

describe('/api/devices', () => {
  let supabaseMock: any;

  beforeEach(() => {
    jest.clearAllMocks();
    supabaseMock = createClient('', '');
  });

  describe('GET /api/devices', () => {
    it('should return all devices for authenticated user', async () => {
      const mockDevices = [
        {
          id: '123',
          name: 'Living Room Switch',
          type: 'plus_2pm',
          user_id: 'test-user-id'
        },
        {
          id: '456',
          name: 'Motion Sensor',
          type: 'motion_2',
          user_id: 'test-user-id'
        }
      ];

      const fromMock = supabaseMock.from();
      fromMock.select.mockReturnThis();
      fromMock.eq.mockResolvedValue({ data: mockDevices, error: null });

      const request = new NextRequest('http://localhost:3000/api/devices');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockDevices);
      expect(supabaseMock.from).toHaveBeenCalledWith('devices');
      expect(fromMock.eq).toHaveBeenCalledWith('user_id', 'test-user-id');
    });

    it('should handle database errors', async () => {
      const fromMock = supabaseMock.from();
      fromMock.select.mockReturnThis();
      fromMock.eq.mockResolvedValue({ data: null, error: new Error('Database error') });

      const request = new NextRequest('http://localhost:3000/api/devices');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch devices');
    });
  });

  describe('POST /api/devices', () => {
    it('should create a new device', async () => {
      const newDevice = {
        name: 'New Switch',
        type: 'plus_2pm',
        ip_address: '192.168.1.100',
        mac_address: '00:11:22:33:44:55'
      };

      const createdDevice = {
        id: '789',
        ...newDevice,
        user_id: 'test-user-id',
        created_at: new Date()
      };

      const fromMock = supabaseMock.from();
      fromMock.insert.mockReturnThis();
      fromMock.select.mockReturnThis();
      fromMock.single.mockResolvedValue({ data: createdDevice, error: null });

      const request = new NextRequest('http://localhost:3000/api/devices', {
        method: 'POST',
        body: JSON.stringify(newDevice)
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual(createdDevice);
      expect(fromMock.insert).toHaveBeenCalledWith({
        ...newDevice,
        user_id: 'test-user-id'
      });
    });

    it('should validate required fields', async () => {
      const invalidDevice = {
        name: 'New Switch'
        // Missing required fields
      };

      const request = new NextRequest('http://localhost:3000/api/devices', {
        method: 'POST',
        body: JSON.stringify(invalidDevice)
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Missing required fields');
    });

    it('should validate device type', async () => {
      const invalidDevice = {
        name: 'New Switch',
        type: 'invalid_type',
        ip_address: '192.168.1.100',
        mac_address: '00:11:22:33:44:55'
      };

      const request = new NextRequest('http://localhost:3000/api/devices', {
        method: 'POST',
        body: JSON.stringify(invalidDevice)
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Invalid device type');
    });
  });

  describe('PUT /api/devices/[id]', () => {
    it('should update an existing device', async () => {
      const deviceId = '123';
      const updates = {
        name: 'Updated Switch',
        ip_address: '192.168.1.101'
      };

      const updatedDevice = {
        id: deviceId,
        ...updates,
        type: 'plus_2pm',
        user_id: 'test-user-id'
      };

      const fromMock = supabaseMock.from();
      fromMock.update.mockReturnThis();
      fromMock.eq.mockReturnThis();
      fromMock.select.mockReturnThis();
      fromMock.single.mockResolvedValue({ data: updatedDevice, error: null });

      const request = new NextRequest(`http://localhost:3000/api/devices/${deviceId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });

      const response = await PUT(request, { params: { id: deviceId } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(updatedDevice);
      expect(fromMock.update).toHaveBeenCalledWith(updates);
      expect(fromMock.eq).toHaveBeenCalledWith('id', deviceId);
      expect(fromMock.eq).toHaveBeenCalledWith('user_id', 'test-user-id');
    });

    it('should handle non-existent device', async () => {
      const deviceId = 'non-existent';
      const updates = { name: 'Updated' };

      const fromMock = supabaseMock.from();
      fromMock.update.mockReturnThis();
      fromMock.eq.mockReturnThis();
      fromMock.select.mockReturnThis();
      fromMock.single.mockResolvedValue({ data: null, error: null });

      const request = new NextRequest(`http://localhost:3000/api/devices/${deviceId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });

      const response = await PUT(request, { params: { id: deviceId } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Device not found');
    });
  });

  describe('DELETE /api/devices/[id]', () => {
    it('should delete a device', async () => {
      const deviceId = '123';

      const fromMock = supabaseMock.from();
      fromMock.delete.mockReturnThis();
      fromMock.eq.mockReturnThis();
      fromMock.eq.mockResolvedValue({ error: null });

      const request = new NextRequest(`http://localhost:3000/api/devices/${deviceId}`, {
        method: 'DELETE'
      });

      const response = await DELETE(request, { params: { id: deviceId } });

      expect(response.status).toBe(204);
      expect(fromMock.delete).toHaveBeenCalled();
      expect(fromMock.eq).toHaveBeenCalledWith('id', deviceId);
      expect(fromMock.eq).toHaveBeenCalledWith('user_id', 'test-user-id');
    });

    it('should handle delete errors', async () => {
      const deviceId = '123';

      const fromMock = supabaseMock.from();
      fromMock.delete.mockReturnThis();
      fromMock.eq.mockReturnThis();
      fromMock.eq.mockResolvedValue({ error: new Error('Delete failed') });

      const request = new NextRequest(`http://localhost:3000/api/devices/${deviceId}`, {
        method: 'DELETE'
      });

      const response = await DELETE(request, { params: { id: deviceId } });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to delete device');
    });
  });

  describe('GET /api/devices/[id]', () => {
    it('should return a single device', async () => {
      const deviceId = '123';
      const mockDevice = {
        id: deviceId,
        name: 'Living Room Switch',
        type: 'plus_2pm',
        user_id: 'test-user-id',
        device_status: {
          online: true,
          data: {
            switch: [
              { id: 0, output: true, apower: 100 }
            ]
          }
        }
      };

      const fromMock = supabaseMock.from();
      fromMock.select.mockReturnThis();
      fromMock.eq.mockReturnThis();
      fromMock.single.mockResolvedValue({ data: mockDevice, error: null });

      const request = new NextRequest(`http://localhost:3000/api/devices/${deviceId}`);
      const response = await GET_SINGLE(request, { params: { id: deviceId } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockDevice);
      expect(fromMock.eq).toHaveBeenCalledWith('id', deviceId);
      expect(fromMock.eq).toHaveBeenCalledWith('user_id', 'test-user-id');
    });

    it('should handle device not found', async () => {
      const deviceId = 'non-existent';

      const fromMock = supabaseMock.from();
      fromMock.select.mockReturnThis();
      fromMock.eq.mockReturnThis();
      fromMock.single.mockResolvedValue({ data: null, error: null });

      const request = new NextRequest(`http://localhost:3000/api/devices/${deviceId}`);
      const response = await GET_SINGLE(request, { params: { id: deviceId } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Device not found');
    });
  });
});