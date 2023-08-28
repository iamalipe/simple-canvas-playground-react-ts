import {
  LogoutProfilePopupItem,
  SettingProfilePopupItem,
  ThemeProfilePopupItem,
} from ".";

export const ProfilePopup = () => {
  return (
    <div className="ml-auto relative flex justify-end">
      <label htmlFor="profile-popup" className="z-[9999] cursor-pointer">
        <img
          className="w-9 h-9 daisy-rounded"
          src="https://dummyimage.com/400x400/000/fff"
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
              currentUser?.profile.email
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
