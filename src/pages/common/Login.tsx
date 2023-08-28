import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../types";
import { useState, useEffect } from "react";

const noErrors = {
  email: null,
  password: null,
  other: null,
};
const initLoginInfo = {
  email: "",
  password: "",
};

const Login = () => {
  const navigate = useNavigate();
  const [loginInfo, setLoginInfo] = useState(initLoginInfo);
  const [loginError, setLoginError] = useState(noErrors);

  // useEffect(() => {
  //   if (currentUser) navigate(RouteNames.HOME);
  // }, [currentUser]);

  const onChangeLoginInfo: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
    setLoginInfo((prev) => ({ ...prev, [fieldName]: fieldValue }));
  };

  const onFormSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoginError(noErrors);
    try {
      // await app.logIn(
      //   RealmWeb.Credentials.emailPassword(
      //     loginInfo.email.toLowerCase(),
      //     loginInfo.password
      //   )
      // );
      setLoginInfo(initLoginInfo);
      // location.reload();
    } catch (err) {
      console.log(err);
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
              Don't have an account?
              <Link
                to={RouteNames.SIGNUP}
                className="daisy-link font-semibold ml-1"
              >
                Sign up
              </Link>
            </span>
          </div>
        </div>
        <form onSubmit={onFormSubmit} className="flex flex-col gap-4">
          <label>
            <span className="text-lg font-medium ml-2">Email</span>
            <input
              value={loginInfo.email}
              onChange={onChangeLoginInfo}
              name="email"
              type="email"
              placeholder="enter your email"
              className="daisy-input daisy-input-bordered text-lg daisy-input-md w-full mt-1"
            />
            {loginError.email && (
              <span className="text-error text-sm font-medium ml-2">
                {loginError.email}
              </span>
            )}
          </label>
          <label>
            <span className="text-lg font-medium ml-2">Password</span>
            <input
              value={loginInfo.password}
              onChange={onChangeLoginInfo}
              name="password"
              type="password"
              placeholder="enter your password"
              className="daisy-input daisy-input-bordered text-lg daisy-input-md w-full mt-1"
            />
            {loginError.password && (
              <span className="text-error text-sm font-medium ml-2">
                {loginError.password}
              </span>
            )}
          </label>
          <button className="daisy-btn daisy-btn-primary">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
