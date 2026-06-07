import { USER_ROLE } from "@/lib";

export interface UserApiResponse {
  id: string;
  username: string;
  email: string;
  role: USER_ROLE;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date;
}

export interface UserCreateRequest {
 /*  medicalRecordNumber: string;
  fullName: string;
  documentType: PATIENT_DOCUMENT_TYPE;
  documentNumber: string;
  birthDate: string;
  sex: PATIENT_SEX;
  phone: string;
  email: string;
  address: string | null;
  notes: string | null; */
}

export interface UserUpdateRequest extends UserCreateRequest {}

export interface UserDetailsInterface {
  email: string;
  role: USER_ROLE | null;
  username: string;
}
