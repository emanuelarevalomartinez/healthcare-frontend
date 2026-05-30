export interface PatientApiResponse {
  id: string;
  medicalRecordNumber: string;
  fullName: string;
  documentType: string;
  documentNumber: string;
  birthDate: Date;
  sex: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  createdById: string;
  createdAt: Date;
}

export interface PatientCreateRequest {
  medicalRecordNumber: string;
  fullName: string;
  documentType: PATIENT_DOCUMENT_TYPE;
  documentNumber: string;
  birthDate: Date;
  sex: PATIENT_SEX;
  phone: string;
  email: string;
  address: string | null;
  notes: string | null;
}

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
