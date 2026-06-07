import { USER_ROLE } from "@/lib";
import { UserForm } from "@/modules/user/forms/user-form";

export default async function () {
  return (
    <UserForm
      mode="create"
      user={{
        id: "",
        username: "",
        email: "",
        role: undefined as unknown as USER_ROLE,
        active: false,
        createdAt: undefined as unknown as Date,
        updatedAt: undefined as unknown as Date,
        lastLogin: undefined as unknown as Date,
      }}
    />
  );
}
