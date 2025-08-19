import { TestBed } from '@angular/core/testing';

import { NotificationService } from './notification.service';
import { Notification } from '../models/notification.model';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationService]
    });
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('showSuccess', () => {
    it('should create a success notification with default duration', () => {
      const message = 'Operation completed successfully';
      service.showSuccess(message);

      const notifications = service.getNotifications();
      expect(notifications.length).toBe(1);
      expect(notifications[0]).toEqual({
        message,
        type: 'success',
        duration: 5000,
        dismissible: true
      });
    });

    it('should create a success notification with custom duration', () => {
      const message = 'Custom duration success';
      const duration = 3000;
      service.showSuccess(message, duration);

      const notifications = service.getNotifications();
      expect(notifications[0].duration).toBe(duration);
    });
  });

  describe('showError', () => {
    it('should create an error notification with default duration', () => {
      const message = 'An error occurred';
      service.showError(message);

      const notifications = service.getNotifications();
      expect(notifications.length).toBe(1);
      expect(notifications[0]).toEqual({
        message,
        type: 'error',
        duration: 8000,
        dismissible: true
      });
    });

    it('should create an error notification with custom duration', () => {
      const message = 'Custom duration error';
      const duration = 10000;
      service.showError(message, duration);

      const notifications = service.getNotifications();
      expect(notifications[0].duration).toBe(duration);
    });
  });

  describe('showWarning', () => {
    it('should create a warning notification with default duration', () => {
      const message = 'Warning message';
      service.showWarning(message);

      const notifications = service.getNotifications();
      expect(notifications.length).toBe(1);
      expect(notifications[0]).toEqual({
        message,
        type: 'warning',
        duration: 6000,
        dismissible: true
      });
    });

    it('should create a warning notification with custom duration', () => {
      const message = 'Custom duration warning';
      const duration = 4000;
      service.showWarning(message, duration);

      const notifications = service.getNotifications();
      expect(notifications[0].duration).toBe(duration);
    });
  });

  describe('showInfo', () => {
    it('should create an info notification with default duration', () => {
      const message = 'Information message';
      service.showInfo(message);

      const notifications = service.getNotifications();
      expect(notifications.length).toBe(1);
      expect(notifications[0]).toEqual({
        message,
        type: 'info',
        duration: 4000,
        dismissible: true
      });
    });

    it('should create an info notification with custom duration', () => {
      const message = 'Custom duration info';
      const duration = 2000;
      service.showInfo(message, duration);

      const notifications = service.getNotifications();
      expect(notifications[0].duration).toBe(duration);
    });
  });

  describe('showNotification', () => {
    it('should add a custom notification to the list', () => {
      const customNotification: Notification = {
        message: 'Custom notification',
        type: 'info',
        duration: 1000,
        dismissible: false
      };

      service.showNotification(customNotification);

      const notifications = service.getNotifications();
      expect(notifications).toContain(customNotification);
    });

    it('should handle notification with no duration', () => {
      const notification: Notification = {
        message: 'No duration notification',
        type: 'success',
        dismissible: true
      };

      service.showNotification(notification);

      const notifications = service.getNotifications();
      expect(notifications[0].duration).toBeUndefined();
    });

    it('should handle notification with zero duration', () => {
      const notification: Notification = {
        message: 'Zero duration notification',
        type: 'warning',
        duration: 0,
        dismissible: true
      };

      service.showNotification(notification);

      const notifications = service.getNotifications();
      expect(notifications[0].duration).toBe(0);
    });
  });

  describe('removeNotification', () => {
    it('should remove a specific notification', () => {
      const notification1: Notification = {
        message: 'First notification',
        type: 'success'
      };
      const notification2: Notification = {
        message: 'Second notification',
        type: 'error'
      };

      service.showNotification(notification1);
      service.showNotification(notification2);

      expect(service.getNotifications().length).toBe(2);

      service.removeNotification(notification1);

      const remainingNotifications = service.getNotifications();
      expect(remainingNotifications.length).toBe(1);
      expect(remainingNotifications[0]).toEqual(notification2);
    });

    it('should handle removing non-existent notification', () => {
      const notification: Notification = {
        message: 'Test notification',
        type: 'info'
      };

      service.showNotification(notification);
      expect(service.getNotifications().length).toBe(1);

      const nonExistentNotification: Notification = {
        message: 'Non-existent',
        type: 'warning'
      };

      service.removeNotification(nonExistentNotification);
      expect(service.getNotifications().length).toBe(1);
    });
  });

  describe('clearAll', () => {
    it('should remove all notifications', () => {
      service.showSuccess('Success message');
      service.showError('Error message');
      service.showWarning('Warning message');

      expect(service.getNotifications().length).toBe(3);

      service.clearAll();

      expect(service.getNotifications().length).toBe(0);
    });

    it('should handle clearing empty notification list', () => {
      expect(service.getNotifications().length).toBe(0);

      service.clearAll();

      expect(service.getNotifications().length).toBe(0);
    });
  });

  describe('getNotifications', () => {
    it('should return a copy of notifications array', () => {
      service.showSuccess('Test message');

      const notifications1 = service.getNotifications();
      const notifications2 = service.getNotifications();

      expect(notifications1).toEqual(notifications2);
      expect(notifications1).not.toBe(notifications2); // Should be different references
    });

    it('should return empty array when no notifications exist', () => {
      const notifications = service.getNotifications();
      expect(notifications).toEqual([]);
    });
  });

  describe('multiple notifications', () => {
    it('should handle multiple notifications of different types', () => {
      service.showSuccess('Success 1');
      service.showError('Error 1');
      service.showWarning('Warning 1');
      service.showInfo('Info 1');
      service.showSuccess('Success 2');

      const notifications = service.getNotifications();
      expect(notifications.length).toBe(5);

      const types = notifications.map(n => n.type);
      expect(types).toEqual(['success', 'error', 'warning', 'info', 'success']);
    });

    it('should maintain notification order', () => {
      service.showSuccess('First');
      service.showError('Second');
      service.showWarning('Third');

      const notifications = service.getNotifications();
      expect(notifications[0].message).toBe('First');
      expect(notifications[1].message).toBe('Second');
      expect(notifications[2].message).toBe('Third');
    });
  });
});
