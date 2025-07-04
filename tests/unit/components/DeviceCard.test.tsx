import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeviceCard from '@/components/devices/DeviceCard';
import { ShellyDevice } from '@/types/shelly';

// Mock device data
const mockPlus2PMDevice: ShellyDevice & { device_status?: any } = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'Living Room Switch',
  type: 'plus_2pm',
  ip_address: '192.168.1.100',
  mac_address: '00:11:22:33:44:55',
  firmware_version: '1.0.0',
  auth_enabled: false,
  last_seen: new Date(),
  online: true,
  device_status: {
    online: true,
    data: {
      switch: [
        { id: 0, output: true, apower: 125.5, voltage: 230, current: 0.54 },
        { id: 1, output: false, apower: 0, voltage: 230, current: 0 }
      ]
    }
  }
};

const mockMotion2Device: ShellyDevice & { device_status?: any } = {
  id: '223e4567-e89b-12d3-a456-426614174000',
  name: 'Hallway Motion',
  type: 'motion_2',
  ip_address: '192.168.1.101',
  mac_address: '00:11:22:33:44:66',
  firmware_version: '1.0.0',
  auth_enabled: false,
  last_seen: new Date(),
  online: true,
  device_status: {
    online: true,
    data: {
      sensor: {
        motion: false,
        lux: 150,
        temperature: 22.5,
        battery: { percent: 85, voltage: 3.7 },
        vibration: false
      }
    }
  }
};

describe('DeviceCard', () => {
  const mockOnRefresh = jest.fn();
  const mockOnControl = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Plus 2PM Device', () => {
    it('should render device information correctly', () => {
      render(
        <DeviceCard 
          device={mockPlus2PMDevice} 
          onRefresh={mockOnRefresh}
          onControl={mockOnControl}
        />
      );

      expect(screen.getByText('Living Room Switch')).toBeInTheDocument();
      expect(screen.getByText('Online')).toBeInTheDocument();
      expect(screen.getByText('2PM Switch')).toBeInTheDocument();
      expect(screen.getByText('IP: 192.168.1.100')).toBeInTheDocument();
    });

    it('should display power consumption for each channel', () => {
      render(
        <DeviceCard 
          device={mockPlus2PMDevice} 
          onRefresh={mockOnRefresh}
          onControl={mockOnControl}
        />
      );

      expect(screen.getByText('Channel 1')).toBeInTheDocument();
      expect(screen.getByText('125.5W')).toBeInTheDocument();
      expect(screen.getByText('Channel 2')).toBeInTheDocument();
      expect(screen.getByText('0W')).toBeInTheDocument();
    });

    it('should handle switch toggle', async () => {
      render(
        <DeviceCard 
          device={mockPlus2PMDevice} 
          onRefresh={mockOnRefresh}
          onControl={mockOnControl}
        />
      );

      const switches = screen.getAllByRole('checkbox');
      expect(switches[0]).toBeChecked();
      expect(switches[1]).not.toBeChecked();

      fireEvent.click(switches[0]);
      
      await waitFor(() => {
        expect(mockOnControl).toHaveBeenCalledWith(0, false);
      });
    });

    it('should handle refresh click', () => {
      render(
        <DeviceCard 
          device={mockPlus2PMDevice} 
          onRefresh={mockOnRefresh}
          onControl={mockOnControl}
        />
      );

      const refreshButton = screen.getByLabelText(/refresh/i);
      fireEvent.click(refreshButton);

      expect(mockOnRefresh).toHaveBeenCalled();
    });

    it('should display offline status correctly', () => {
      const offlineDevice = {
        ...mockPlus2PMDevice,
        device_status: { online: false }
      };

      render(
        <DeviceCard 
          device={offlineDevice} 
          onRefresh={mockOnRefresh}
          onControl={mockOnControl}
        />
      );

      expect(screen.getByText('Offline')).toBeInTheDocument();
      expect(screen.queryByText('Channel 1')).not.toBeInTheDocument();
    });
  });

  describe('Motion 2 Device', () => {
    it('should render motion sensor information', () => {
      render(
        <DeviceCard 
          device={mockMotion2Device} 
          onRefresh={mockOnRefresh}
        />
      );

      expect(screen.getByText('Hallway Motion')).toBeInTheDocument();
      expect(screen.getByText('Motion Sensor')).toBeInTheDocument();
      expect(screen.getByText('Motion: Clear')).toBeInTheDocument();
      expect(screen.getByText('Light: 150 lux')).toBeInTheDocument();
      expect(screen.getByText('Temperature: 22.5°C')).toBeInTheDocument();
      expect(screen.getByText('Battery: 85%')).toBeInTheDocument();
    });

    it('should show motion detected state', () => {
      const deviceWithMotion = {
        ...mockMotion2Device,
        device_status: {
          online: true,
          data: {
            sensor: {
              ...mockMotion2Device.device_status.data.sensor,
              motion: true
            }
          }
        }
      };

      render(
        <DeviceCard 
          device={deviceWithMotion} 
          onRefresh={mockOnRefresh}
        />
      );

      expect(screen.getByText('Motion: Detected')).toBeInTheDocument();
    });

    it('should not show control options for motion sensor', () => {
      render(
        <DeviceCard 
          device={mockMotion2Device} 
          onRefresh={mockOnRefresh}
        />
      );

      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show loading indicator when control is in progress', async () => {
      render(
        <DeviceCard 
          device={mockPlus2PMDevice} 
          onRefresh={mockOnRefresh}
          onControl={mockOnControl}
        />
      );

      // Mock slow control response
      mockOnControl.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));

      const switches = screen.getAllByRole('checkbox');
      fireEvent.click(switches[0]);

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(
        <DeviceCard 
          device={mockPlus2PMDevice} 
          onRefresh={mockOnRefresh}
          onControl={mockOnControl}
        />
      );

      expect(screen.getByRole('article')).toHaveAttribute('aria-label', 'Device: Living Room Switch');
      expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    });

    it('should be keyboard navigable', () => {
      render(
        <DeviceCard 
          device={mockPlus2PMDevice} 
          onRefresh={mockOnRefresh}
          onControl={mockOnControl}
        />
      );

      const refreshButton = screen.getByLabelText(/refresh/i);
      const switches = screen.getAllByRole('checkbox');

      // Tab to refresh button
      refreshButton.focus();
      expect(document.activeElement).toBe(refreshButton);

      // Tab to switches
      switches[0].focus();
      expect(document.activeElement).toBe(switches[0]);

      // Space/Enter should toggle
      fireEvent.keyDown(switches[0], { key: 'Enter', code: 'Enter' });
      expect(mockOnControl).toHaveBeenCalled();
    });
  });
});