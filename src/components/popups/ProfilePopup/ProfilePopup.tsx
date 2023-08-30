import { useAtomValue } from "jotai";
import {
  LogoutProfilePopupItem,
  SettingProfilePopupItem,
  ThemeProfilePopupItem,
} from ".";
import { userAtom } from "../../../state";

export const ProfilePopup = () => {
  const userState = useAtomValue(userAtom);

  return (
    <div className="ml-auto relative flex justify-end">
      <label htmlFor="profile-popup" className="z-[9999] cursor-pointer">
        <img
          className="w-9 h-9 daisy-rounded bg-primary"
          src={"https://dummyimage.com/1000x1000/000/fff&text=Profile"}
        />
      </label>
      <input type="checkbox" className="hidden" id="profile-popup" />
      <div className="profile-popup-target relative flex justify-end">
        <label
          htmlFor="profile-popup"
          className="hidden w-full h-full fixed top-0 left-0 z-[9998] profile-popup-target-close"
        ></label>
        <div className="fixed profile-popup-target-main h-[0rem] flex flex-col daisy-rounded w-60 bg-base-200 mt-10 drop-shadow-xl shadow-xl z-[9999] overflow-hidden transition-all">
          <div className="h-12 border-b border-b-base-300 px-4 flex items-center justify-between">
            <span className="overflow-hidden text-ellipsis font-medium">
              {userState?.fullName || userState?.email}
            </span>
          </div>
          <SettingProfilePopupItem />
          <ThemeProfilePopupItem />
          <LogoutProfilePopupItem />
        </div>
      </div>
    </div>
  );
};
