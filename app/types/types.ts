
// Fix: Added React import to resolve "Cannot find namespace 'React'" errors for ReactNode
import React from 'react';

export interface NavItem {
  label: string;
  href: string;
}

export interface ValueItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
}

export interface StatItem {
  id: string;
  label: string;
  value: string;
  suffix: string;
}

export interface TestimonialItem {
  id: string;
  content: string;
  author: string;
  handle: string;
  avatar: string;
}
