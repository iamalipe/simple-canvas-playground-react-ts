import { useAtomValue } from "jotai";
import { userAtom } from "../../../state";
import { useState, useEffect } from "react";

export const SettingModal = () => {
  const userState = useAtomValue(userAtom);
  const [newUserState, setNewUserState] = useState<{
    profileImage: string | null;
    fullName: string | null;
  }>({
    profileImage: null,
    fullName: null,
  });

  useEffect(() => {
    if (!userState) return;
    setNewUserState({
      fullName: userState.fullName,
      profileImage: userState.profileImage,
    });
  }, [userState]);

  return (
    <>
      <dialog id="SettingModal" className="daisy-modal">
        <form method="dialog" className="daisy-modal-box">
          <button className="daisy-btn daisy-btn-sm daisy-btn-circle daisy-btn-ghost absolute right-2 top-2">
            ✕
          </button>
          <div className="gap-2 flex flex-col">
            <div>
              <label htmlFor="" className="flex flex-col gap-4">
                <div className="">
                  <img
                    className="w-1/2 daisy-rounded"
                    src={
                      newUserState.profileImage ||
                      "https://dummyimage.com/1000x1000/000/fff&text=Profile"
                    }
                    alt="profile"
                  />
                </div>
                <input
                  type="file"
                  className="daisy-file-input daisy-file-input-bordered daisy-file-input-sm w-full"
                />
              </label>
              {/* <span className="text-error text-sm">Error</span> */}
            </div>
            <div>
              <label htmlFor="" className="flex flex-col">
                <span className="font-medium text-lg">Full Name</span>
                <input
                  value={newUserState.fullName || ""}
                  type="text"
                  className="daisy-input daisy-input-bordered w-full daisy-input-sm"
                  placeholder={
                    newUserState.fullName || "enter set your name here"
                  }
                />
              </label>
              {/* <span className="text-error text-sm">Error</span> */}
            </div>
            <div>
              <label htmlFor="" className="flex flex-col">
                <span className="font-medium text-lg">Email</span>
                <input
                  disabled
                  value={userState?.email}
                  type="text"
                  className="daisy-input daisy-input-bordered w-full daisy-input-sm"
                />
              </label>
              {/* <span className="text-error text-sm">Error</span> */}
            </div>
            <div>
              <label htmlFor="" className="flex flex-col">
                <span className="font-medium text-lg">Current password</span>
                <input
                  type="text"
                  className="daisy-input daisy-input-bordered w-full daisy-input-sm"
                />
              </label>
              {/* <span className="text-error text-sm">Error</span> */}
            </div>
            <div>
              <label htmlFor="" className="flex flex-col">
                <span className="font-medium text-lg">New password</span>
                <input
                  type="text"
                  className="daisy-input daisy-input-bordered w-full daisy-input-sm"
                />
              </label>
              {/* <span className="text-error text-sm">Error</span> */}
            </div>
            <div>
              <label htmlFor="" className="flex flex-col">
                <span className="font-medium text-lg">
                  Re-type new password
                </span>
                <input
                  type="text"
                  className="daisy-input daisy-input-bordered w-full daisy-input-sm"
                />
              </label>
              {/* <span className="text-error text-sm">Error</span> */}
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <button className="daisy-btn daisy-btn-sm daisy-btn-outline">
                Reset
              </button>
              <button className="daisy-btn daisy-btn-sm daisy-btn-neutral">
                Save
              </button>
            </div>
          </div>
        </form>
      </dialog>
    </>
  );
};
