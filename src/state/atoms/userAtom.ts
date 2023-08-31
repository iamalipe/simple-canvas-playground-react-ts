import { User } from "firebase/auth";
import { atom } from "jotai";
import { UserInterface } from "../../types";

export const userAuthAtom = atom<User | null>(null);
export const userAtom = atom<UserInterface | null>(null);
export const profileImageUrlAtom = atom<string | null>(null);
