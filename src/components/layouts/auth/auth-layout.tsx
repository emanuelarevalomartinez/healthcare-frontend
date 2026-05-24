export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-screen h-full justify-center">
      <div className="flex h-full">{children}</div>
    </div>
  );
}
