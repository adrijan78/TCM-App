import { Training } from "./Training";

export interface MemberTrainingData {
  id: number;
  date: string;
  description: string;
  trainingId: number;
  training: Training;
  memberId: number;
  member: any;
  performace: number;
}
