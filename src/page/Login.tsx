import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { FC } from "react";
import { verifyGoogleIdToken } from "../utils/utils";
import { notification } from "antd";

export const LoginPage:FC = () => {

  const [api] = notification.useNotification();

  const openNotification = (type:string, title:string, message:string) => {
    switch (type) {
      case "success":
        api.success({
          message: title,
          description: message,
          placement: "topRight",
        });
        break;
      case "error":
        api.error({
          message: title,
          description: message,
          placement: "topRight",
        });
        break;
    
      default:
        api.info({
          message: title,
          description: message,
          placement: "topRight",
        });
        break;
    }
  };

  const handleGoogleLogin = async(res:CredentialResponse) => {
    if (!res.credential) {
      openNotification("error", "Lỗi đăng nhập", "Đăng nhập bằng Google thất bại!")
    } else {
      try {
        const payload = await verifyGoogleIdToken(res.credential);
        console.log(payload);
      } catch (err) {
        openNotification("error", "Lỗi đăng nhập", "Đăng nhập bằng Google thất bại, hãy thử lại sau!")
      }
    }
  }

  return (
    <div className="login-bg">
      <div className="login-box">
        <div className="login-title">Đăng nhập</div>
        <div className="login-desc">Quý phụ huynh hãy đăng nhập để có thể đăng ký khoá học.</div>
        <GoogleLogin
          onSuccess={credentialResponse => {
            handleGoogleLogin(credentialResponse);
          }}
          onError={() => {
            openNotification("error", "Lỗi đăng nhập", "Đăng nhập bằng Google thất bại, hãy thử lại sau!")
          }}
        />
      </div>
    </div>
  )
}