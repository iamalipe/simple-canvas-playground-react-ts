export interface UserInterface {
  uid: string;
  email: string;
  fullName: string | null;
  authMode: string;
  profileImage: string | null;
  createdAt: Date | string;
  modifyAt: Date | string;
}
