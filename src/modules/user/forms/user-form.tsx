"use client"

import { FormMode } from "@/lib";
import { UserApiResponse } from "../types";

interface UserFormProps {
  user: UserApiResponse;
  mode: FormMode;
}

export function UserForm({ user, mode }: UserFormProps){

    return(
        <>
          <div> UserForm </div>
        </>
    )

}