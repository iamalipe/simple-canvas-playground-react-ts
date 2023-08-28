import { useNavigate, useSearchParams } from "react-router-dom";
import { RouteNames } from "../../types";
import { useState, useEffect } from "react";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const tokenId = searchParams.get("tokenId");

  // failed, verifying, successful
  const [state, setState] = useState(
    token === null && tokenId === null ? "failed" : "verifying"
  );

  const navigate = useNavigate();

  // useEffect(() => {
  //   if (currentUser) navigate(RouteNames.HOME);
  // }, [currentUser]);

  const confirmUser = async () => {
    if (!token) return;
    if (!tokenId) return;
    try {
      // await app.emailPasswordAuth.confirmUser({ token, tokenId });
      setState("successful");
    } catch (e) {
      console.log(e);
      setState("failed");
    }
  };

  // useEffect(() => {
  //   confirmUser();
  // }, []);

  return (
    <div className="flex-1 flex justify-center">
      <div className="flex flex-col w-full max-w-md mt-[20%] sm:mt-[10%] h-fit px-4">
        <div className="text-center">
          <div className="text-xl sm:text-3xl font-semibold mb-3 tracking-tight flex justify-center items-baseline">
            <span>Email {state}</span>
            {state === "verifying" && (
              <div className="dot-animation">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify;
