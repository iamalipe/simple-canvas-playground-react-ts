import { signOut } from "firebase/auth";
import { firebaseAuth } from "../../../hooks";

export const LogoutProfilePopupItem = () => {
  const onLogout = async () => {
    await signOut(firebaseAuth);
    window.location.reload();
  };

  return (
    <div className="h-12 border-b border-b-base-300 px-4 flex items-center">
      <button
        onClick={onLogout}
        className="daisy-btn daisy-btn-neutral daisy-btn-sm w-full"
      >
        Logout
      </button>
    </div>
  );
};
