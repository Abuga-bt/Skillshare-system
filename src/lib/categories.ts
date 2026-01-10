import { 
  Laptop, 
  Home, 
  GraduationCap, 
  Palette, 
  Heart, 
  Briefcase, 
  Car, 
  MoreHorizontal 
} from 'lucide-react';

export const SKILL_CATEGORIES = {
  technology: { label: 'Technology', icon: Laptop, color: 'bg-blue-100 text-blue-700' },
  home_services: { label: 'Home Services', icon: Home, color: 'bg-orange-100 text-orange-700' },
  education: { label: 'Education', icon: GraduationCap, color: 'bg-green-100 text-green-700' },
  creative: { label: 'Creative', icon: Palette, color: 'bg-pink-100 text-pink-700' },
  health_wellness: { label: 'Health & Wellness', icon: Heart, color: 'bg-red-100 text-red-700' },
  business: { label: 'Business', icon: Briefcase, color: 'bg-indigo-100 text-indigo-700' },
  transportation: { label: 'Transportation', icon: Car, color: 'bg-yellow-100 text-yellow-700' },
  other: { label: 'Other', icon: MoreHorizontal, color: 'bg-gray-100 text-gray-700' },
} as const;

export type SkillCategory = keyof typeof SKILL_CATEGORIES;
