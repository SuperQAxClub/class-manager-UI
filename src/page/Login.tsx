import { GoogleLogin } from "@react-oauth/google";
import { FC } from "react";

export const LoginPage:FC = () => {
  return (
    <div className="login-bg">
      <div className="login-box">
        <div className="login-title">Đăng nhập</div>
        <div className="login-desc">Quý phụ huynh hãy đăng nhập để có thể đăng ký khoá học.</div>
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