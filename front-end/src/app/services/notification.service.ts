import { Injectable } from '@angular/core';

/**
 * Types of notifications that can be displayed
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

/**
 * Represents a notification message
 */
export interface Notification {
  /** The message to display */
  message: string;
  /** The type of notification */
  type: NotificationType;
  /** Duration in milliseconds (optional, defaults to 5000ms) */
  duration?: number;
  /** Whether the notification can be dismissed */
  dismissible?: boolean;
}

/**
 * Service responsible for displaying notifications to users
 * Provides methods for showing success, error, warning, and info messages
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notifications: Notification[] = [];

  /**
   * Shows a success notification
   * @param message - The success message to display
   * @param duration - Duration in milliseconds (default: 5000ms)
   */
  showSuccess(message: string, duration: number = 5000): void {
    this.showNotification({
      message,
      type: 'success',
      duration,
      dismissible: true,
    });
  }

  /**
   * Shows an error notification
   * @param message - The error message to display
   * @param duration - Duration in milliseconds (default: 8000ms)
   */
  showError(message: string, duration: number = 8000): void {
    this.showNotification({
      message,
      type: 'error',
      duration,
      dismissible: true,
    });
  }

  /**
   * Shows a warning notification
   * @param message - The warning message to display
   * @param duration - Duration in milliseconds (default: 6000ms)
   */
  showWarning(message: string, duration: number = 6000): void {
    this.showNotification({
      message,
      type: 'warning',
      duration,
      dismissible: true,
    });
  }

  /**
   * Shows an info notification
   * @param message - The info message to display
   * @param duration - Duration in milliseconds (default: 4000ms)
   */
  showInfo(message: string, duration: number = 4000): void {
    this.showNotification({
      message,
      type: 'info',
      duration,
      dismissible: true,
    });
  }

  /**
   * Shows a custom notification
   * @param notification - The notification object
   */
  showNotification(notification: Notification): void {
    this.notifications.push(notification);

    // Log to console for development
    console.log(`[${notification.type.toUpperCase()}] ${notification.message}`);

    // Auto-remove notification after duration
    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        this.removeNotification(notification);
      }, notification.duration);
    }
  }

  /**
   * Removes a specific notification
   * @param notification - The notification to remove
   */
  removeNotification(notification: Notification): void {
    const index = this.notifications.indexOf(notification);
    if (index > -1) this.notifications.splice(index, 1);
  }

  /**
   * Clears all notifications
   */
  clearAll(): void {
    this.notifications = [];
  }

  /**
   * Gets all current notifications
   * @returns Array of current notifications
   */
  getNotifications(): Notification[] {
    return [...this.notifications];
  }
}
