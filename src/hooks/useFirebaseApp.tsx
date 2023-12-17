import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { firebaseConfig } from "../config";
import { useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";
import { profileImageUrlAtom, userAtom, userAuthAtom } from "../state";
import { FirestoreDatabaseNames, UserInterface } from "../types";

export const firebaseApp = initializeApp(firebaseConfig);

export const firebaseAnalytics = getAnalytics(firebaseApp);
export const firebaseAuth = getAuth(firebaseApp);
setPersistence(firebaseAuth, browserLocalPersistence);

export const firebaseFirestore = getFirestore(firebaseApp);
export const firebaseStorage = getStorage(firebaseApp);

export const useFirebaseApp = () => {
  // const [userAuthState, setUserAuthState] = useAtom(userAuthAtom);
  // const setUserState = useSetAtom(userAtom);
  // const setProfileImageUrlState = useSetAtom(profileImageUrlAtom);
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
  //     setUserAuthState(user);
  //   });
  //   return () => {
  //     unsubscribe();
  //   };
  // }, [setUserAuthState]);
  // useEffect(() => {
  //   if (!userAuthState) return;
  //   const unsubscribe = onSnapshot(
  //     doc(firebaseFirestore, FirestoreDatabaseNames.USERS, userAuthState.uid),
  //     async (doc) => {
  //       if (doc.exists()) {
  //         const data = doc.data() as UserInterface;
  //         setUserState(data);
  //         if (data.profileImage) {
  //           const downloadURL = await getDownloadURL(
  //             ref(firebaseStorage, data.profileImage)
  //           );
  //           setProfileImageUrlState(downloadURL);
  //         }
  //       }
  //     }
  //   );
  //   return () => {
  //     unsubscribe();
  //   };
  // }, [setProfileImageUrlState, setUserState, userAuthState]);
};
