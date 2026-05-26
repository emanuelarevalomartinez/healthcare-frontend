import { NavigationMenuSearch } from "@/modules/navigation-menu/items/navigation-menu-search";
import { NavigationUserProfile } from "./items/navigation-user-profile";
import { NavigationUserNotifications } from "./items/navigation-user-notifications";
import { NavigationUserLanguage } from "./items/navigation-user-language";

export function NavigationMenu() {
  return (
    <>
      <header
        className={`flex top-0 bg-background backdrop-blur w-full`}
      >
        <div className="flex w-full h-20 pr-4">
          <NavigationMenuSearch />

          <div className="flex items-center gap-3">
            <NavigationUserLanguage />
            <NavigationUserNotifications />
            <NavigationUserProfile />
          </div>
        </div>
      </header>
    </>
  );
}
