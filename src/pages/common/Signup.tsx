import { Link, useNavigate } from "react-router-dom";
import { FirestoreDatabaseNames, RouteNames, UserInterface } from "../../types";
import { useState } from "react";
import { firebaseAuth, firebaseFirestore } from "../../hooks";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  NoErrorsAuthenticationInterface,
  handleFirebaseAuthError,
} from "../../utils";
import { doc, setDoc } from "firebase/firestore";

const noErrors: NoErrorsAuthenticationInterface = {
  email: null,
  password: null,
  other: null,
};
const initSignupInfo = {
  email: "",
  password: "",
};

const Signup = () => {
  const [signupInfo, setSignupInfo] = useState(initSignupInfo);
  const [signupError, setSignupError] = useState(noErrors);

  const navigate = useNavigate();

  const onChangeSignupInfo: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
    setSignupInfo((prev) => ({ ...prev, [fieldName]: fieldValue }));
  };

  const onFormSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setSignupError(noErrors);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        signupInfo.email.toLowerCase(),
        signupInfo.password
      );

      const user = userCredential.user;
      const userPayload: UserInterface = {
        uid: user.uid,
        email: user.email || "",
        createdAt: user.metadata.creationTime || new Date(),
        modifyAt: user.metadata.creationTime || new Date(),
        fullName: user.displayName,
        profileImage: user.photoURL,
        authMode: "password",
      };
      await setDoc(
        doc(firebaseFirestore, FirestoreDatabaseNames.USERS, userPayload.uid),
        userPayload
      );
      setSignupInfo(initSignupInfo);
      navigate(RouteNames.LOGIN);
    } catch (error) {
      handleFirebaseAuthError(error, setSignupError);
      console.error(error);
    }
  };

  return (
    <div className="flex-1 flex justify-center">
      <div className="flex flex-col w-full max-w-md mt-[20%] sm:mt-[10%] h-fit px-4">
        <div className="text-center">
          <div className="text-3xl font-semibold mb-3 tracking-tight">
            Welcome to Chat App
          </div>
          <div className="btn-group mb-6">
            <span>
              Already have an account?
              <Link
                to={RouteNames.LOGIN}
                className="daisy-link font-semibold ml-1"
              >
                Login
              </Link>
            </span>
          </div>
        </div>
        <form onSubmit={onFormSubmit} className="flex flex-col gap-4">
          <label>
            <span className="text-lg font-medium ml-2">Email</span>
            <input
              value={signupInfo.email}
              onChange={onChangeSignupInfo}
              name="email"
              type="email"
              placeholder="enter your email"
              className="daisy-input daisy-input-bordered text-lg daisy-input-md w-full mt-1"
            />
            {signupError.email && (
              <span className="text-error text-sm font-medium ml-2">
                {signupError.email}
              </span>
            )}
          </label>
          <label>
            <span className="text-lg font-medium ml-2">Password</span>
            <input
              value={signupInfo.password}
              onChange={onChangeSignupInfo}
              name="password"
              type="password"
              placeholder="enter your password"
              className="daisy-input daisy-input-bordered text-lg daisy-input-md w-full mt-1"
            />
            {signupError.password && (
              <span className="text-error text-sm font-medium ml-2">
                {signupError.password}
              </span>
            )}
            {signupError.other && (
              <span className="text-error text-sm font-medium ml-2">
                {signupError.other}
              </span>
            )}
          </label>
          <button className="daisy-btn daisy-btn-primary">Sign up</button>
        </form>
      </div>
    </div>
  );
};
export default Signup;
