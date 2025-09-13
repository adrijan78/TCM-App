import {
  MemberTrainingData,
  SimpleMemberAttendanceData,
} from './MemberTrainingData';

export interface Training {
  id: number;
  date: Date;
  description: string;
  status: string;
  notes?: string;
  trainingType: string;
}

export interface TrainingDetails {
  id: number;
  date: Date;
  description: string;
  status: string;
  trainingType: string;
  memberTrainings: MemberTrainingData[];
}

export interface TrainingForEdit {
  id: number;
  date: Date;
  description: string;
  status: string;
  trainingType: string;
  membersToAttend: SimpleMemberAttendanceData[];
}
