export type TabType = 'home' | 'students' | 'settings';

export type SubscriptionStatus = 'ALL' | 'OVERDUE' | 'DUE_SOON' | 'UP_TO_DATE';

export type PaymentMethod = 'Bank Transfer' | 'Cash' | 'Mercado Pago' | 'Card';

export interface PaymentRecord {
  id: string;
  studentId: string;
  amount: number;
  date: string; // YYYY-MM-DD
  method: PaymentMethod;
  notes?: string;
}

export interface Student {
  id: string;
  name: string;
  subject: string;
  countryCode: string;
  phone: string;
  amount: number;
  dueDate: string; // YYYY-MM-DD
  notes?: string;
  payments: PaymentRecord[];
  createdAt: string;
}

export interface UserProfile {
  name: string;
  role: string;
  avatarUrl: string;
  customWhatsappMsg: string;
  currencySymbol: string;
}

export interface CalculatedStatus {
  status: 'OVERDUE' | 'DUE_SOON' | 'UP_TO_DATE';
  label: string;
  daysDiff: number;
  badgeBg: string;
  badgeText: string;
  badgeDot: string;
}
