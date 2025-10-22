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
  sellerTestimonial?: string;
  rating: number;
  reviewCount: number;
  stats: FreelancerStats;
  memberSince: string;
}

export interface Service {
  id: string;
  freelancerId: string;
  categoryId: string;
  title: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  price: number;
  ordersInQueue: number;
  description: string;
  features: string[];
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

export interface Review {
  id: string;
  authorName: string;
  authorAvatarUrl: string;
  rating: number;
  comment: string;
  date: string;
}