import React from 'react';

export interface Category {
  id: string;
  name: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface FreelancerStats {
  responseTime: number;
  ordersCompleted: number;
  onTimeDeliveryRate: number;
}

export interface Freelancer {
  id: string;
  name: string;
  title: string;
  avatarUrl: string;
  level: string;
  description: string;
  bio?: string;
  skills?: string[];
  languages?: string[];
  sellerTestimonial?: string;
  rating: number;
  reviewCount: number;
  stats: FreelancerStats;
  memberSince: string;
}

export interface ServicePackage {
  id: string;
  serviceId: string;
  name: string;
  tier: 'basic' | 'standard' | 'premium';
  description: string;
  price: number;
  deliveryDays: number;
  revisions: number;
  features: string[];
  isActive: boolean;
}

export interface Service {
  id: string;
  freelancerId: string;
  sellerId?: string;
  categoryId: string;
  category?: string;
  title: string;
  slug?: string;
  imageUrl: string;
  galleryUrls?: string[];
  tags?: string[];
  rating: number;
  reviewCount: number;
  price: number;
  ordersInQueue: number;
  totalSales?: number;
  description: string;
  features?: string[];
  packages?: ServicePackage[];
  isActive?: boolean;
  createdAt?: string;
}

export type OrderStatus = 'pending' | 'in_progress' | 'in_revision' | 'delivered' | 'completed' | 'cancelled' | 'dispute';

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  serviceId: string;
  packageId: string;
  status: OrderStatus;
  amount: number;
  commission: number;
  deliveryDate?: string;
  requirements?: string;
  deliveryMessage?: string;
  deliveryFiles?: string[];
  cancellationReason?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderMessage {
  id: string;
  orderId: string;
  senderId: string;
  message: string;
  attachments?: string[];
  isSystemMessage: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participant1: string;
  participant2: string;
  lastMessageAt: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  attachments?: string[];
  isRead: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  orderId: string;
  serviceId: string;
  reviewerId: string;
  sellerId: string;
  rating: number;
  comment: string;
  response?: string;
  createdAt: string;
  reviewerName?: string;
  reviewerAvatar?: string;
}

export interface Favorite {
  id: string;
  userId: string;
  serviceId: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  clientName: string;
  clientTitle: string;
  clientAvatarUrl: string;
}

export interface Project {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  budget: {
    min: number;
    max: number;
  };
  postedAt: string;
  proposalsCount: number;
}