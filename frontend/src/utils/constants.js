export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const NOTIFICATION_TYPES = {
  ANNOUNCEMENT: 'announcement',
  ALERT: 'alert',
  INFO: 'info',
  WARNING: 'warning'
};

export const PRIORITY_LEVELS = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high'
};

export const EVENT_CATEGORIES = {
  SEMINAR: 'seminar',
  WORKSHOP: 'workshop',
  CONFERENCE: 'conference',
  CAREER: 'career',
  OTHER: 'other'
};

export const READ_STATUS = {
  READ: 'READ',
  UNREAD: 'UNREAD'
};

export const ROUTES = {
  HOME: '/',
  ROLE_SELECTION: '/role-selection',
  STUDENT_DASHBOARD: '/student',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin',
  NOTIFICATION_READ: '/notification-read'
};