import { Users } from './users';

export class Notifications {
  notificationId: string;
  title: string;
  description: string;
  referenceId: string;
  isRead: boolean;
  user: Users;
  date: Date;
  type: 'ANNOUNCEMENT' |
  'TENANT_RENT_BOOKING' |
  'TENANT_RENT_CONTRACT' |
  'TENANT_RENT_BILLING_REMINDER' |
  'TENANT_RENT_CONTRACT_PAYMENT';
}
