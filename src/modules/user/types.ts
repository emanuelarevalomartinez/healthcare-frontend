import { USER_ROLE } from "@/lib";

export interface UserApiResponse {
  id: string;
  username: string;
  email: string;
  role: USER_ROLE;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date;
}

export interface UserCreateRequest {
  username: string;
  password: string;
  email: string;
  role: USER_ROLE;
  isActive: boolean;
}
export interface UserUpdateRequest {
  username?: string;
  password?: string;
  email?: string;
  role?: USER_ROLE;
  isActive?: boolean;
}

export interface UserDetailsInterface {
  email: string;
  role: USER_ROLE | null;
  username: string;
}
