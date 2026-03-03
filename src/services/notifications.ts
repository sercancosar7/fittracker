import PushNotification from 'react-native-push-notification';
import { Platform } from 'react-native';

const CHANNEL_ID = 'fittracker-reminders';

/**
 * Initialize push notification configuration.
 * Should be called once in App.tsx on mount.
 */
export function setupNotifications(): void {
  PushNotification.configure({
    onRegister: function (token) {
      // TODO: send token to backend for server-side push
      // console.log('Push token:', token);
    },

    onNotification: function (notification) {
      // handle notification tap
      // TODO: navigate to relevant screen based on notification.data
      notification.finish('backgroundFetchResultNoData' as any);
    },

    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    popInitialNotification: true,
    requestPermissions: Platform.OS === 'ios',
  });

  // Android needs channels
  if (Platform.OS === 'android') {
    PushNotification.createChannel(
      {
        channelId: CHANNEL_ID,
        channelName: 'Workout Reminders',
        channelDescription: 'Notifications for workout reminders and achievements',
        importance: 4, // HIGH
        vibrate: true,
      },
      (created) => {
        // channel created callback - not much to do here
      },
    );
  }
}

/**
 * Schedule a daily workout reminder
 */
export function scheduleWorkoutReminder(hour: number, minute: number): void {
  // cancel existing reminders first
  PushNotification.cancelAllLocalNotifications();

  const now = new Date();
  let fireDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0);

  // if the time already passed today, schedule for tomorrow
  if (fireDate <= now) {
    fireDate.setDate(fireDate.getDate() + 1);
  }

  PushNotification.localNotificationSchedule({
    channelId: CHANNEL_ID,
    title: 'Time to Train!',
    message: "Don't break your streak. Let's get a workout in today.",
    date: fireDate,
    repeatType: 'day',
    allowWhileIdle: true,
    // smallIcon on android
    smallIcon: 'ic_notification',
  });
}

/**
 * Show an immediate local notification (for achievements, etc.)
 */
export function showNotification(title: string, message: string): void {
  PushNotification.localNotification({
    channelId: CHANNEL_ID,
    title,
    message,
    playSound: true,
    soundName: 'default',
  });
}

/**
 * Cancel all scheduled notifications
 */
export function cancelAllReminders(): void {
  PushNotification.cancelAllLocalNotifications();
}
