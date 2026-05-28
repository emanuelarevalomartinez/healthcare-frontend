"use client";

import { TableWrapper } from "@/components/customs/table-wrapper";
import { useEffect, useState } from "react";
import { getAllPatients } from "../services";

export interface ApiResponse {
  status: number;
  type: null;
  message: null;
  origin: null;
  data: Data;
  error: null;
}

export interface Data {
  content: Content[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface Content {
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

export function PatientList() {
  const [patients, setPatients] = useState<Data>();

  useEffect(() => {
    const response = async () => {
      const data = await getAllPatients();
      setPatients(data.data);
    };
    response();
  }, []);

  return (
    <>
      <div>Pacientes</div>
      <div>
        <TableWrapper />
      </div>
      <div>
        {patients?.content?.map((patient) => (
          <div className="flex flex-col" key={patient.id}>
            {patient.address}
            {new Date(patient.birthDate).toLocaleDateString()}
            {new Date(patient.createdAt).toLocaleDateString()}
            {patient.createdById}
            {patient.documentNumber}
            {patient.documentType}
            {patient.email}
            {patient.fullName}
            {patient.id}
            {patient.medicalRecordNumber}
            {patient.notes}
            {patient.phone}
            {patient.sex}
          </div>
        ))}
      </div>
    </>
  );
}
