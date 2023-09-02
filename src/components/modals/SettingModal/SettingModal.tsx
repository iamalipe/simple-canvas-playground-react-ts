import { useAtom, useAtomValue } from "jotai";
import { profileImageUrlAtom, userAtom } from "../../../state";
import { useState, useEffect, useRef } from "react";
import {
  firebaseAuth,
  firebaseFirestore,
  firebaseStorage,
} from "../../../hooks";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { FirestoreDatabaseNames } from "../../../types";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  signOut,
} from "firebase/auth";
import { toast } from "../../../utils";

const initPasswordState = {
  currentPassword: "",
  newPassword: "",
  retypeNewPassword: "",
};

const initPasswordErrorState: {
  currentPassword: string | null;
  newPassword: string | null;
  retypeNewPassword: string | null;
  others: string | null;
} = {
  currentPassword: null,
  newPassword: null,
  retypeNewPassword: null,
  others: null,
};

export const SettingModal = () => {
  const userState = useAtomValue(userAtom);
  const [profileImageUrlState, setProfileImageUrlState] =
    useAtom(profileImageUrlAtom);
  const profileUploadRef = useRef<HTMLInputElement | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);

  const [password, setPassword] = useState(initPasswordState);
  const [passwordError, setPasswordError] = useState(initPasswordErrorState);

  const isChangePasswordVisible =
    password.currentPassword.length > 3 &&
    password.newPassword.length > 3 &&
    password.retypeNewPassword.length > 3 &&
    password.newPassword === password.retypeNewPassword;

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

  const onChangePassword: React.MouseEventHandler<HTMLButtonElement> = async (
    e
  ) => {
    e.preventDefault();
    if (!firebaseAuth.currentUser) return;
    setPasswordError(initPasswordErrorState);
    try {
      const credential = EmailAuthProvider.credential(
        firebaseAuth.currentUser.email || "",
        password.currentPassword
      );
      await reauthenticateWithCredential(firebaseAuth.currentUser, credential);
      await updatePassword(firebaseAuth.currentUser, password.newPassword);
      toast("password change successful");
      await signOut(firebaseAuth);
      window.location.reload();
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      switch (error.code) {
        case "auth/wrong-password":
          setPasswordError((prev) => ({
            ...prev,
            currentPassword: "wrong password",
          }));
          break;
        case "auth/weak-password":
          setPasswordError((prev) => ({
            ...prev,
            newPassword: "weak password",
            retypeNewPassword: "weak password",
          }));
          break;
        default:
          setPasswordError((prev) => ({
            ...prev,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            others: error.message,
          }));
          break;
      }
      console.log(error);
    }
    // updatePassword
  };

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
            </div>
            <div>
              <label htmlFor="" className="flex flex-col">
                <span className="font-medium text-lg">Full Name</span>
                <input
                  onBlur={onNameChange}
                  value={fullName || ""}
                  onChange={(e) => setFullName(e.target.value)}
                  type="text"
                  name="fullName"
                  className="daisy-input daisy-input-bordered w-full daisy-input-sm"
                  placeholder={fullName || "enter set your name here"}
                />
              </label>
            </div>
            <div>
              <label htmlFor="" className="flex flex-col">
                <span className="font-medium text-lg">Email</span>
                <input
                  defaultValue={userState?.email || ""}
                  disabled
                  type="text"
                  name="email"
                  className="daisy-input daisy-input-bordered w-full daisy-input-sm"
                />
              </label>
            </div>
            <div>
              <label htmlFor="" className="flex flex-col">
                <span className="font-medium text-lg">Current password</span>
                <input
                  value={password.currentPassword}
                  onChange={(e) =>
                    setPassword((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                  name="currentPassword"
                  type="password"
                  className="daisy-input daisy-input-bordered w-full daisy-input-sm"
                />
              </label>
              {passwordError.currentPassword && (
                <span className="text-error text-sm">
                  {passwordError.currentPassword}
                </span>
              )}
            </div>
            <div>
              <label htmlFor="" className="flex flex-col">
                <span className="font-medium text-lg">New password</span>
                <input
                  value={password.newPassword}
                  onChange={(e) =>
                    setPassword((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  name="newPassword"
                  type="password"
                  className="daisy-input daisy-input-bordered w-full daisy-input-sm"
                />
              </label>
              {passwordError.newPassword && (
                <span className="text-error text-sm">
                  {passwordError.newPassword}
                </span>
              )}
            </div>
            <div>
              <label htmlFor="" className="flex flex-col">
                <span className="font-medium text-lg">
                  Re-type new password
                </span>
                <input
                  value={password.retypeNewPassword}
                  onChange={(e) =>
                    setPassword((prev) => ({
                      ...prev,
                      retypeNewPassword: e.target.value,
                    }))
                  }
                  name="retypeNewPassword"
                  type="password"
                  className="daisy-input daisy-input-bordered w-full daisy-input-sm"
                />
              </label>
              {passwordError.retypeNewPassword && (
                <span className="text-error text-sm">
                  {passwordError.retypeNewPassword}
                </span>
              )}
              {passwordError.others && (
                <span className="text-error text-sm">
                  {passwordError.others}
                </span>
              )}
            </div>
            <div className="flex justify-end gap-4 mt-4">
              {isChangePasswordVisible && (
                <button
                  onClick={onChangePassword}
                  className="daisy-btn daisy-btn-sm daisy-btn-neutral"
                >
                  Change Password
                </button>
              )}
            </div>
          </div>
        </form>
      </dialog>
    </>
  );
};
