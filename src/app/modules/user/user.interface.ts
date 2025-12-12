// import { UserRole } from "@prisma/enums";

import { Role } from "@prisma/client";



// import { Role } from "prisma/generated/prisma/enums";

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  password?: string;
  phone?: string;
  photo?: string;
}
