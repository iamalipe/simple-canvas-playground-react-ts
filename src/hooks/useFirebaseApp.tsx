import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
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
import { userAtom, userAuthAtom } from "../state";
import { FirestoreDatabaseNames, UserInterface } from "../types";

export const firebaseApp = initializeApp(firebaseConfig);

export const firebaseAnalytics = getAnalytics(firebaseApp);
export const firebaseAuth = getAuth(firebaseApp);
setPersistence(firebaseAuth, browserLocalPersistence);

export const firebaseFirestore = getFirestore(firebaseApp);

export const useFirebaseApp = () => {
  const [userAuthState, setUserAuthState] = useAtom(userAuthAtom);
  const setUserState = useSetAtom(userAtom);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setUserAuthState(user);
    });
    return () => {
      unsubscribe();
    };
  }, [setUserAuthState]);

  useEffect(() => {
    if (!userAuthState) return;
    const unsubscribe = onSnapshot(
      doc(firebaseFirestore, FirestoreDatabaseNames.USERS, userAuthState.uid),
      (doc) => {
        if (doc.exists()) setUserState(doc.data() as UserInterface);
      }
    );
    return () => {
      unsubscribe();
    };
  }, [setUserState, userAuthState]);
};
