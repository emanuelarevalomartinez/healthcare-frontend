import { USER_ROLE } from "@/lib";

export interface UserCreateRequest {
  username: string;
  password: string;
  email: string;
  role: USER_ROLE;
}
