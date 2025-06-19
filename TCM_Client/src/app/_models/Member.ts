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
}

export interface LoginMember {
  firstName: string;
  lastName: string;
  email: string;
  token: string;
}
