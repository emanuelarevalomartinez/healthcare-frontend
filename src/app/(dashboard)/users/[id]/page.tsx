import { UserForm } from "@/modules/user/forms/user-form";
import { findUserById } from "@/modules/user/services";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ({ params }: PageProps) {
  const { id } = await params;
  const response = await findUserById(id);

  return (
    <UserForm
      mode="details"
      user={{
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        role: response.data.role,
        isActive: response.data.isActive,
        createdAt: response.data.createdAt,
        updatedAt: response.data.updatedAt,
        lastLogin: response.data.lastLogin,
      }}
    />
  );
}
