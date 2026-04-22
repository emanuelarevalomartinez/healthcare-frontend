export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex items-center h-[75vh]">{children}</div>
    </div>
  );
}
