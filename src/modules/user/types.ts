import { USER_ROLE } from "@/lib";
import { DoctorApiResponse } from "../doctors/types";

export interface UserApiResponse {
  id: string;
  username: string;
  email: string;
  role: USER_ROLE;
  isActive: boolean;
  doctor: DoctorApiResponse | null,
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
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
