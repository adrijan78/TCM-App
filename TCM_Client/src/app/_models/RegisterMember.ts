import { Belt } from "./Belt";

export interface RegisterMember {
  firstName: string;
  lastName: string;
  password: string;
  dateOfBirth: Date;
  email: string;
  height: number;
  weight: number;
  rolesIds:number[];
  belt:Belt
}
