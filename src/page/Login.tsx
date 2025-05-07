import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { FC, useEffect, useState } from "react";
import { saveSession, verifyGoogleIdToken } from "../utils/utils";
import { Modal, notification } from "antd";
import { ParentFormValues, UserFormComponent } from "../modules/Profile/UserForm";
import { CreateProfileRequest, CreateProfileResponse, CreateProfileStudentRequest, LoginResponse, requestCreateProfile, requestLogin } from "../api/auth";
import { useAccountStore } from "../store/accountStore";
import { useLocation } from "wouter";

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
  const {profile, setProfile} = useAccountStore();
  const [, navigate] = useLocation();

  const [creatingModal, setCreatingModal] = useState<boolean>(false);
  const [tmpProfileRequest, setTmpProfileRequest] = useState<CreateProfileType | null>(null);
  const [tmpFormData, setTmpFormData] = useState<ParentFormValues | null>(null);

  useEffect(() => {
    if(profile) {
      navigate("/course");
    }
  }, [profile])

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
    setCreatingModal(true);
    if(!formValues.students.length) {
      openNotification("error", "Thiếu học sinh", "Hãy khai báo ít nhất 1 học sinh!")
    } else if(tmpProfileRequest) {
      let studentRequest:CreateProfileStudentRequest[] = [];
      formValues.students.forEach(student => {
        studentRequest.push({
          name: student.studentName,
          schoolId: student.school === "other" ? null : student.school,
          classId: student.class || null,
          studentCode: student.studentCode || null,
          gender: student.gender,
          gradeId: student.grade
        })
      })
      const createRequest:CreateProfileRequest = {
        name: formValues.name,
        mobile: formValues.phone,
        gender: formValues.gender,
        avatar_url: tmpProfileRequest.avatar_url,
        email: tmpProfileRequest.email,
        google_id: tmpProfileRequest.google_id,
        studentList: studentRequest
      }
      const createProfileRequest = await requestCreateProfile<CreateProfileResponse>(createRequest);
      console.log(createProfileRequest)
      if(createProfileRequest.error) {
        openNotification("error", "Lỗi", "Đã xảy ra lỗi khi tạo tài khoản")
      } else if(createProfileRequest.items) {
        setProfile(createProfileRequest.items.user);
        saveSession(createProfileRequest.items.session);
        openNotification("success", "Thành công", "Tài khoản đã được tạo và đã đăng nhập.");
        navigate("/course");
      }
    }
    setCreatingModal(false);
  }

  const handleGoogleLogin = async(res:CredentialResponse) => {
    if (!res.credential) {
      openNotification("error", "Lỗi đăng nhập", "Đăng nhập bằng Google thất bại!")
    } else {
      try {
        const payload = await verifyGoogleIdToken(res.credential);
        const checkLogin = await requestLogin<LoginResponse>(payload.sub);
        if(checkLogin.error) {
          openNotification("error", "Lỗi đăng nhập", "Đăng nhập bằng Google thất bại, hãy thử lại sau!")
        } else if (checkLogin.items) {
          const loginStatus = checkLogin.items.status;
          switch (loginStatus) {
            case "sign-up":
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
                gender: "",
                students: []
              })
              break;
            case "success":
              if(checkLogin.items.user && checkLogin.items.session) {
                setProfile(checkLogin.items.user);
                saveSession(checkLogin.items.session);
                openNotification("success", "Thành công", "Đăng nhập thành công");
                navigate("/course");
              }
              break;
            default:
              break;
          }
          
        }
      } catch (err) {
        openNotification("error", "Lỗi đăng nhập", "Đăng nhập bằng Google thất bại, hãy thử lại sau!")
      }
    }
  }

  return (
    <>
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
      <Modal
        open={creatingModal}
        width={500}
        closable={false}
        footer={null}
        centered
      >
        <div className="modal-loading">
          <div className="loading-icon"></div>
          <div className="loading-text">
            Đang tạo tài khoản
          </div>
        </div>
      </Modal>
    </>
  )
}