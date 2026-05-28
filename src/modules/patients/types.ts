

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

