import { USER_ROLE } from "@/lib";

export interface LoginApiResponse {
  id: string;
  username: string;
  email: string;
  role: USER_ROLE;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
  accessToken: string;
  refreshToken: string;
}

export interface UserRegisterRequest {
   email: string;
   password: string;
}

