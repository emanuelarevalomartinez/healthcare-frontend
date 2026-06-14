export interface PatientApiResponse {
  id: string;
  medicalRecordNumber: string;
  fullName: string;
  documentType: string;
  documentNumber: string;
  birthDate: string;
  sex: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  createdById: string;
  createdAt: string;
}

export interface PatientCreateRequest {
  medicalRecordNumber: string;
  fullName: string;
  documentType: PATIENT_DOCUMENT_TYPE;
  documentNumber: string;
  birthDate: string;
  sex: PATIENT_SEX;
  phone: string;
  email: string;
  address: string | null;
  notes: string | null;
}

export interface PatientUpdateRequest extends PatientCreateRequest {}


export enum PATIENT_DOCUMENT_TYPE {
  DNI='DNI',
  PASSPORT='PASSPORT',
  ID_CARD='ID_CARD',
  OTHER='OTHER',
}

export enum PATIENT_SEX {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}
