export interface Note {
  title: string;
  content: string;
  createdAt: Date;
  fromMemberId: number;
  toMemberId: number;
}
