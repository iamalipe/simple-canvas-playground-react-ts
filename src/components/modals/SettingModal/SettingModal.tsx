import { useAtom, useAtomValue } from "jotai";
import { profileImageUrlAtom, userAtom } from "../../../state";
import { useState, useEffect, useRef } from "react";
import { firebaseFirestore, firebaseStorage } from "../../../hooks";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { FirestoreDatabaseNames } from "../../../types";

export const SettingModal = () => {
  const userState = useAtomValue(userAtom);
  const [profileImageUrlState, setProfileImageUrlState] =
    useAtom(profileImageUrlAtom);
  const profileUploadRef = useRef<HTMLInputElement | null>(null);

  const [fullName, setFullName] = useState<string | null>(null);

  useEffect(() => {
    if (!userState) return;
    setFullName(userState.fullName);
  }, [userState]);

  const onChangeFile: React.ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    try {
      if (!userState) return;
      const fileList = e.target.files;
      if (!fileList) return;
      const fileExtSplit = fileList[0].name.split(".");
      const fileExt = fileExtSplit[fileExtSplit.length - 1];
      const path = `usersProfiles/${userState.uid}.${fileExt}`;
      const storageRef = ref(firebaseStorage, path);
      await uploadBytes(storageRef, fileList[0]);

      // Save the path to user-profile
      await updateDoc(
        doc(firebaseFirestore, FirestoreDatabaseNames.USERS, userState.uid),
        {
          profileImage: path,
        }
      );

      const downloadURL = await getDownloadURL(ref(firebaseStorage, path));
      setProfileImageUrlState(downloadURL);
      if (!profileUploadRef.current) return;
      profileUploadRef.current.value = "";
    } catch (error) {
      console.log(error);
    }
  };

  const onNameChange = async () => {
    if (!userState) return;
    if (!fullName) return;
    if (fullName.length < 2) return;
    await updateDoc(
      doc(firebaseFirestore, FirestoreDatabaseNames.USERS, userState.uid),
      {
        fullName: fullName,
      }
    );
    setFullName(fullName);
  };
  const onSave = () => {};

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
                      profileImageUrlState ||
                      "https://dummyimage.com/1000x1000/000/fff&text=Profile"
                    }
                    alt="profile"
                  />
                </div>
                <input
                  onChange={onChangeFile}
                  type="file"
                  ref={profileUploadRef}
                  accept="image/png, image/jpeg"
                  className="daisy-file-input daisy-file-input-bordered daisy-file-input-sm w-full"
                />
              </label>
              {/* <span className="text-error text-sm">Error</span> */}
            </div>
            <div>
              <label htmlFor="" className="flex flex-col">
                <span className="font-medium text-lg">Full Name</span>
                <input
                  onBlur={onNameChange}
                  value={fullName || ""}
                  onChange={(e) => setFullName(e.target.value)}
                  type="text"
                  className="daisy-input daisy-input-bordered w-full daisy-input-sm"
                  placeholder={fullName || "enter set your name here"}
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
              {/* <button className="daisy-btn daisy-btn-sm daisy-btn-outline">
                Reset
              </button> */}
              <button
                onClick={onSave}
                className="daisy-btn daisy-btn-sm daisy-btn-neutral"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </dialog>
    </>
  );
};
