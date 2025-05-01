import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { FC, useState } from "react";
import { verifyGoogleIdToken } from "../utils/utils";
import { notification } from "antd";
import { ParentFormValues, UserFormComponent } from "../modules/Profile/UserForm";

type CreateProfileType = { 
  name:string,
  mobile: string,
  gender: string,
  avatar_url: string,
  email: string,
  google_id: string,
  studentList: []
}

export const LoginPage:FC = () => {

  const [tmpProfileRequest, setTmpProfileRequest] = useState<CreateProfileType | null>(null);
  const [tmpFormData, setTmpFormData] = useState<ParentFormValues | null>(null);

  const openNotification = (type:string, title:string, message:string) => {
    switch (type) {
      case "success":
        notification.success({
          message: title,
          description: message,
          placement: "topRight",
        });
        break;
      case "error":
        notification.error({
          message: title,
          description: message,
          placement: "topRight",
        });
        break;
    
      default:
        notification.info({
          message: title,
          description: message,
          placement: "topRight",
        });
        break;
    }
  };

  const handleCreateProfile = async(formValues:ParentFormValues) => {
    if(!formValues.students.length) {
      openNotification("error", "Thiếu học sinh", "Hãy khai báo ít nhất 1 học sinh!")
    }
  }

  const handleGoogleLogin = async(res:CredentialResponse) => {
    if (!res.credential) {
      openNotification("error", "Lỗi đăng nhập", "Đăng nhập bằng Google thất bại!")
    } else {
      try {
        const payload = await verifyGoogleIdToken(res.credential);
        setTmpProfileRequest({
          name: "",
          gender: "",
          mobile: "",
          avatar_url: payload.picture,
          email: payload.email,
          google_id: payload.sub,
          studentList: []
        });
        setTmpFormData({
          name: `${payload.family_name} ${payload.given_name}`,
          phone: "",
          students: []
        })
      } catch (err) {
        openNotification("error", "Lỗi đăng nhập", "Đăng nhập bằng Google thất bại, hãy thử lại sau!")
      }
    }
  }

  return (
    <div className="login-bg">
      {tmpProfileRequest && tmpFormData ? (
        <div className="login-box" style={{width: "800px"}}>
          <div className="login-title" style={{marginBottom: "15px"}}>Khai báo phụ huynh và học sinh</div>
          <UserFormComponent
            defaultValues={tmpFormData}
            submitForm={(values) => handleCreateProfile(values)}
          />
        </div>
      ) : (
        <div className="login-box">
          <div className="login-title">Đăng nhập</div>
          <div className="login-desc">Quý phụ huynh hãy đăng nhập để có thể đăng ký khoá học.</div>
          <div className="login-button-container">
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
      )}
    </div>
  )
}