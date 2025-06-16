export interface Note {
  title: string;
  content: string;
  category: string;
  createdAt: Date;
  fromMemberId: number;
  toMemberId: number;
}