export interface Payment {
  id: number;
  memberId: number;
  memberName: string;
  isPaidOnline: boolean;
  paymentDate: string;
  nextPaymentDate: string;
}
