'use client'

import { TableWrapper } from "@/components/customs/table-wrapper";
import { useEffect, useState } from "react";
import { getAllPatients } from "../services";


export function PatientList(){

    const [patients, setPatients] = useState();




    useEffect(() => {
        const response = async () => {
            setPatients( await getAllPatients());
        }
         response();

         console.log("patients", patients);
    }, [])
    


    return(
        <>
        <div>
            Pacientes
        </div>
           <div>
            <TableWrapper/>
          </div>
        </>
    )

}