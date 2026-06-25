import { USER_ROLE } from "@/lib";
import { DoctorApiResponse } from "@/modules/doctors/types";

export interface LoginApiResponse {
  id: string;
  username: string;
  email: string;
  role: USER_ROLE;
  active: boolean;
  doctor: DoctorApiResponse | null;
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

