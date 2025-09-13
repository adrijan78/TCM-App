import { Training } from './Training';

export interface MemberTrainingData {
  id: number;
  date: string;
  description: string;
  trainingId: number;
  training: Training;
  memberId: number;
  member: any;
  performace: number;
  status: number;
}

export interface SimpleMemberAttendanceData {
  id: number;
  fullName: number;
}
