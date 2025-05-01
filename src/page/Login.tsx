import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { FC, useState } from "react";
import { verifyGoogleIdToken } from "../utils/utils";
import { Modal, notification, Spin } from "antd";
import { ParentFormValues, UserFormComponent } from "../modules/Profile/UserForm";
import { CreateProfileRequest, CreateProfileStudentRequest, requestCreateProfile } from "../api/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

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

  const [creatingModal, setCreatingModal] = useState<boolean>(true);
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
      const createProfileRequest = await requestCreateProfile(createRequest);
      if(createProfileRequest) {
        console.log(createProfileRequest)
      }
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
          gender: "",
          students: []
        })
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