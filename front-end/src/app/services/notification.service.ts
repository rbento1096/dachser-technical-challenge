import { Injectable } from '@angular/core';


export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  message: string;
  type: NotificationType;
  duration?: number;
  dismissible?: boolean;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notifications: Notification[] = [];

  showSuccess(message: string, duration: number = 5000): void {
    this.showNotification({
      message,
      type: 'success',
      duration,
      dismissible: true,
    });
  }

  showError(message: string, duration: number = 8000): void {
    this.showNotification({
      message,
      type: 'error',
      duration,
      dismissible: true,
    });
  }

  showWarning(message: string, duration: number = 6000): void {
    this.showNotification({
      message,
      type: 'warning',
      duration,
      dismissible: true,
    });
  }

  showInfo(message: string, duration: number = 4000): void {
    this.showNotification({
      message,
      type: 'info',
      duration,
      dismissible: true,
    });
  }

  showNotification(notification: Notification): void {
    this.notifications.push(notification);

    console.log(`[${notification.type.toUpperCase()}] ${notification.message}`);

    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        this.removeNotification(notification);
      }, notification.duration);
    }
  }

  removeNotification(notification: Notification): void {
    const index = this.notifications.indexOf(notification);
    if (index > -1) this.notifications.splice(index, 1);
  }

  clearAll(): void {
    this.notifications = [];
  }

  getNotifications(): Notification[] {
    return [...this.notifications];
  }
}
