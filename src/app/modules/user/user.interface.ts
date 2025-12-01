import { UserRole } from "@prisma/enums";

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  phone?: string;
  photo?: string;
}
