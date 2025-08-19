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
