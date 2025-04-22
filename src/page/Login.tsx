import { GoogleLogin } from "@react-oauth/google";
import { FC } from "react";

export const LoginPage:FC = () => {
  return (
    <div className="login-bg">
      <div className="login-box">
        <GoogleLogin
          onSuccess={credentialResponse => {
            console.log(credentialResponse);
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />
      </div>
    </div>
  )
}