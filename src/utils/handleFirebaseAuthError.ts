export interface NoErrorsAuthenticationInterface {
  email: string | null;
  password: string | null;
  other: string | null;
}

export const handleFirebaseAuthError = (
  error: unknown,
  setSignupError: React.Dispatch<
    React.SetStateAction<NoErrorsAuthenticationInterface>
  >
) => {
  // Create a copy of the current error state to avoid overwriting other error messages

  switch (error.code) {
    case "auth/email-already-in-use":
      setSignupError((prev) => ({
        ...prev,
        email: "The email address is already in use by another account.",
      }));
      break;
    case "auth/user-not-found":
      setSignupError((prev) => ({
        ...prev,
        email: "The email address not found.",
      }));
      break;
    case "auth/invalid-email":
      setSignupError((prev) => ({
        ...prev,
        email: "Invalid email address.",
      }));
      break;
    case "auth/weak-password":
      setSignupError((prev) => ({
        ...prev,
        password: "The password is too weak.",
      }));
      break;
    // Add more cases as needed for other error codes
    default:
      setSignupError((prev) => ({
        ...prev,
        other: "An error occurred while signing up. Please try again later.",
      }));
  }
};
