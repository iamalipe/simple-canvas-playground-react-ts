import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { RouteNames } from "../../types";
import { useState } from "react";
import { firebaseAuth } from "../../hooks";
import { confirmPasswordReset, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "../../utils";

const Forgot = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const oobCode = searchParams.get("oobCode");
  const apiKey = searchParams.get("apiKey");

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [othersError, setOthersError] = useState<string | null>(null);

  const isResetPassword =
    mode !== null &&
    oobCode !== null &&
    apiKey !== null &&
    mode === "resetPassword";

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setRetypePassword("");
  };

  const resetError = () => {
    setEmailError(null);
    setPasswordError(null);
    setOthersError(null);
  };

  const onFormSubmitReset: React.FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    e.preventDefault();
    resetError();
    try {
      if (!oobCode) {
        throw new Error("reset link is invalid");
      }
      if (password !== retypePassword) {
        setPasswordError("password won't match");
        return;
      }
      await confirmPasswordReset(firebaseAuth, oobCode, retypePassword);
      resetForm();
      toast("password reset successful");
      navigate(RouteNames.LOGIN);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      switch (error.code) {
        case "auth/user-not-found":
          setEmailError("user not found");
          break;
        case "auth/invalid-action-code":
          setEmailError("reset link is invalid");
          break;
        case "auth/weak-password":
          setPasswordError("Password should be at least 6 characters");
          break;
        default:
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          setOthersError(error.message);
          break;
      }
      console.error(error);
    }
  };

  const onFormSubmitSendResetLink: React.FormEventHandler<
    HTMLFormElement
  > = async (e) => {
    e.preventDefault();
    try {
      resetError();
      await sendPasswordResetEmail(firebaseAuth, email);
      resetForm();
      toast("password reset link send successful");
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      switch (error.code) {
        case "auth/user-not-found":
          setEmailError("user not found");
          break;
        default:
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          setOthersError(error.message);
          break;
      }
      console.error(error);
    }
  };

  return (
    <div className="flex-1 flex justify-center">
      <div className="flex flex-col w-full max-w-md mt-[20%] sm:mt-[10%] h-fit px-4">
        <div className="text-center">
          <div className="text-3xl font-semibold mb-3 tracking-tight">
            Welcome to Simple Canvas Playground
          </div>
          <div className="btn-group mb-6">
            <span>
              Go back to the
              <Link
                to={RouteNames.LOGIN}
                className="daisy-link font-semibold mx-1"
              >
                login
              </Link>
              page
            </span>
          </div>
        </div>
        <form
          onSubmit={
            isResetPassword ? onFormSubmitReset : onFormSubmitSendResetLink
          }
          className="flex flex-col gap-4"
        >
          {!isResetPassword && (
            <label>
              <span className="text-lg font-medium ml-2">Email</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                type="email"
                placeholder="enter your email"
                className="daisy-input daisy-input-bordered text-lg daisy-input-md w-full mt-1"
              />
              {emailError && (
                <span className="text-error text-sm font-medium ml-2">
                  {emailError}
                </span>
              )}
            </label>
          )}
          {isResetPassword && (
            <>
              <label>
                <span className="text-lg font-medium ml-2">Password</span>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  name="password"
                  type="password"
                  placeholder="enter your password"
                  className="daisy-input daisy-input-bordered text-lg daisy-input-md w-full mt-1"
                />
              </label>
              <label>
                <span className="text-lg font-medium ml-2">
                  Retype Password
                </span>
                <input
                  value={retypePassword}
                  onChange={(e) => setRetypePassword(e.target.value)}
                  name="retype-password"
                  type="password"
                  placeholder="re-enter your password"
                  className="daisy-input daisy-input-bordered text-lg daisy-input-md w-full mt-1"
                />
                {passwordError && (
                  <span className="text-error text-sm font-medium ml-2">
                    {passwordError}
                  </span>
                )}
                {othersError && (
                  <span className="text-error text-sm font-medium ml-2">
                    {othersError}
                  </span>
                )}
              </label>
            </>
          )}
          {isResetPassword ? (
            <button className="daisy-btn daisy-btn-primary">
              Reset Password
            </button>
          ) : (
            <button className="daisy-btn daisy-btn-primary">
              Send Reset Link
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Forgot;
