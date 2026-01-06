
import React from 'react';
import { 
  Feather, 
  Users, 
  Zap, 
  ShieldCheck, 
  Edit3, 
  Layout, 
  BarChart3, 
  MessageSquare,
  Twitter,
  Linkedin,
  Github
} from 'lucide-react';
import type { FeatureItem, StatItem, TeamMember, TestimonialItem, ValueItem } from '~/types/types';


export const VALUES: ValueItem[] = [
  {
    id: '1',
    title: 'Pure Creativity',
    description: 'We believe writing should be unhindered. Our tools disappear so your voice can shine.',
    icon: <Feather className="w-8 h-8 text-indigo-600" />
  },
  {
    id: '2',
    title: 'Meaningful Connection',
    description: 'Beyond likes and shares, we foster deep dialogue between writers and their readers.',
    icon: <Users className="w-8 h-8 text-rose-600" />
  },
  {
    id: '3',
    title: 'Radical Simplicity',
    description: 'Elegant design is at our core. No bloat, no clutter, just your words on a clean canvas.',
    icon: <Zap className="w-8 h-8 text-amber-500" />
  },
  {
    id: '4',
    title: 'Safety & Trust',
    description: 'Your data is yours. We prioritize privacy and security above all else.',
    icon: <ShieldCheck className="w-8 h-8 text-emerald-600" />
  }
];

export const FEATURES: FeatureItem[] = [
  {
    id: '1',
    title: 'Distraction-Free Editor',
    description: 'A minimalist workspace that lets you focus on the flow of your thoughts.',
    icon: <Edit3 className="w-6 h-6" />
  },
  {
    id: '2',
    title: 'Total Customization',
    description: 'Personalize your blog to match your unique brand identity with custom domains.',
    icon: <Layout className="w-6 h-6" />
  },
  {
    id: '3',
    title: 'Advanced Analytics',
    description: 'Understand your audience with deep insights that go beyond simple page views.',
    icon: <BarChart3 className="w-6 h-6" />
  },
  {
    id: '4',
    title: 'Global Community',
    description: 'Instantly connect with a network of millions of curious minds.',
    icon: <MessageSquare className="w-6 h-6" />
  }
];

export const TEAM: TeamMember[] = [
  {
    id: '1',
    name: 'Elena Vance',
    role: 'Co-Founder & Design Lead',
    image: 'https://picsum.photos/seed/elena/400/400',
    bio: 'Former typography artist with a passion for digital minimalism.'
  },
  {
    id: '2',
    name: 'Julian Thorne',
    role: 'Co-Founder & Engineering',
    image: 'https://picsum.photos/seed/julian/400/400',
    bio: 'Systems architect dedicated to building the web\'s fastest publishing engine.'
  },
  {
    id: '3',
    name: 'Sarah Chen',
    role: 'Head of Community',
    image: 'https://picsum.photos/seed/sarah/400/400',
    bio: 'Journalist turned community builder, focused on writer growth.'
  }
];

export const STATS: StatItem[] = [
  { id: '1', label: 'Writers', value: '500', suffix: 'K+' },
  { id: '2', label: 'Stories Told', value: '12', suffix: 'M+' },
  { id: '3', label: 'Daily Readers', value: '2', suffix: 'M' },
  { id: '4', label: 'Countries', value: '190', suffix: '+' }
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: '1',
    content: "Inkwell transformed how I share my thoughts. It feels like writing in a beautiful, private journal that happens to reach the world.",
    author: "Marcus Aurelius II",
    handle: "@marcus_writes",
    avatar: "https://picsum.photos/seed/m1/100/100"
  },
  {
    id: '2',
    content: "The cleanest interface I've ever used. I spent hours wrestling with other platforms; here, I just write.",
    author: "Elena Rossi",
    handle: "@elrossi",
    avatar: "https://picsum.photos/seed/m2/100/100"
  },
  {
    id: '3',
    content: "The community is supportive and intellectual. It's not just a blog; it's a digital salon.",
    author: "David Beck",
    handle: "@dbeck_tech",
    avatar: "https://picsum.photos/seed/m3/100/100"
  }
];
