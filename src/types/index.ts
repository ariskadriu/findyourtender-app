export interface User {
  id?: string;
  uid: string;
  fullName: string;
  businessName: string;
  email: string;
  phone?: string;
  language: 'sq' | 'en' | 'sr' | 'de';
  subscriptionStatus: 'active' | 'inactive' | 'cancelled';
  subscriptionEndDate?: Date;
  paddleSubscriptionId?: string;
  savedTenders: string[];
  notificationCategories: string[];
  createdAt: Date;
  role?: 'admin' | 'user';
}

export interface Tender {
  id: string;
  title: string;
  institution: string;
  category: string;
  region: string;
  status: 'active' | 'closed' | 'upcoming' | 'draft';
  publishedDate: Date;
  deadline: Date;
  estimatedValue?: number;
  currency: 'EUR';
  description: string;
  cpvCodes: string[];
  contactInfo?: string;
  sourceUrl: string;
  documents: { name: string; url: string }[];
  createdAt: Date;
  updatedAt: Date;
  featured?: boolean;
  hidden?: boolean;
}

export interface Subscription {
  paddleSubscriptionId: string;
  status: string;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

export type Language = 'sq' | 'en' | 'sr' | 'de';

export const CATEGORIES = [
  'Ndërtim',
  'IT dhe Teknologji',
  'Shëndetësi',
  'Arsim',
  'Transport',
  'Energji',
  'Bujqësi',
  'Shërbime Konsulence',
  'Furnizime',
  'Punë Publike',
  'Tjetër',
];

export const REGIONS = [
  'Prishtinë',
  'Prizren',
  'Pejë',
  'Mitrovicë',
  'Gjilan',
  'Ferizaj',
  'Gjakovë',
  'Vushtrri',
  'Suharekë',
  'Rahovec',
  'Klinë',
  'Dragash',
  'Tjetër',
];
