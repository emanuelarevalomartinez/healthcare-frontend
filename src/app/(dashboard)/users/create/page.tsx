import { USER_ROLE } from "@/lib";
import { UserForm } from "@/modules/user/forms/user-form";

export default async function Page() {
  return (
    <UserForm
      mode="create"
      user={{
        id: "",
        username: "",
        email: "",
        role: undefined as unknown as USER_ROLE,
        isActive: false,
        doctor: {
          id: "",
          modifiedBy: "",
          specialty: "",
          licenseNumber: "",
          defaultConsultationDuration: undefined as unknown as number
        },
        createdAt: "",
        updatedAt: "",
        lastLogin: "",
      }}
    />
  );
}
