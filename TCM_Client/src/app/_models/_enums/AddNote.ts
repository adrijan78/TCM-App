export interface AddNote {
  title: string;
  content: string;
  createdAt: Date;
  fromMemberId: number;
  toMemberId: number;
  trainingId: number | null;
  priority: number;
}
