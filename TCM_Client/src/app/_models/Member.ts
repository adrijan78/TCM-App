import { Belt } from './Belt';
import { ProfilePicture } from './ProfilePicture';

export interface Member {
  id: number;
  firstName: string;
  lastName: string;
  photoId: number;
  profilePicture: ProfilePicture;
  age: number;
  belts: any[];
  email: string;
  isActive: boolean;
  startedOn: string;
  isCoach: boolean;
  height: number;
  weight: number;
  currentBelt: Belt;
  belt: Belt;
  memberRoles: [];
}

export interface LoginMember {
  firstName: string;
  lastName: string;
  email: string;
  token: string;
}

export interface EditMember{
  id: number;
  firstName: string;
  lastName: string;
  photoId: number;
  newPhoto: File;
  dateOfBirth: Date;
  belts: any[];
  email: string;
  isActive: boolean;
  startedOn: string;
  isCoach: boolean;
  height: number;
  weight: number;
  currentBelt: Belt;
  belt: Belt;
  memberRoles: [];
  rolesIds: any[];
}
