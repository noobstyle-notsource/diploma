export type ServiceCategory = 'Coaching' | 'Boosting' | 'Rentals' | 'Gear' | 'Marketplace' | 'Supplements' | 'Products';

export interface Service {
  id: string;
  title: string;
  description: string;
  category: ServiceCategory;
  price: number;
  priceUnit?: string;
  image: string;
  rating?: number;
  reviewsCount?: number;
  verified?: boolean;
  featured?: boolean;
  trending?: boolean;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface Chat {
  id: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

export interface Operator {
  id: string;
  name: string;
  avatar: string;
  description: string;
  rating: number;
  reviewsCount: number;
  verifiedStatus: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'buyer' | 'seller';
  balance: number;
  joinedDate: string;
  bio: string;
}
