export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  fromMemberId: number;
  toMemberId: number;
  trainingId: number | null;
  priority: number;
}
