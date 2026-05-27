import { getCurrentLanguage } from "@/lib/language/language";

export async function Dashboard() {
  
  const language = await getCurrentLanguage();

  return (
    <>
      <div>
        <div>
          <div>{language.dashboard.welcome}</div>
        </div>
      </div>
    </>
  );
}
