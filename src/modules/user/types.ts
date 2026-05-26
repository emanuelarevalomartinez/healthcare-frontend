import { USER_ROLE } from "@/lib";


export interface UserDetailsInterface {
  email: string;
  role: USER_ROLE | null;
  username: string;
}