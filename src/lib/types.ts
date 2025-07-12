import type { StaticImageData } from 'next/image';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  location?: string;
  profilePhotoUrl?: string | StaticImageData;
  skillsOffered: string[];
  skillsWanted: string[];
  availability: string[];
  isPublic: boolean;
  bio?: string;
  ratings: {
    average: number;
    count: number;
  };
}

export interface SkillSwap {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterPhotoUrl?: string | StaticImageData;
  receiverId: string;
  receiverName: string;
  receiverPhotoUrl?: string | StaticImageData;
  offeredSkill: string;
  requestedSkill: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}
