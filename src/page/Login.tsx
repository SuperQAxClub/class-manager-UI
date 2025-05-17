import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { FC, useEffect, useState } from "react";
import { getErrorText, saveSession, verifyGoogleIdToken } from "../utils/utils";
import { Button, Form, Input, Modal, notification } from "antd";
import { ParentFormValues, UserFormComponent, vietnamPhoneRegex } from "../modules/Profile/UserForm";
import { CreateProfileRequest, CreateProfileResponse, CreateProfileStudentRequest, LoginResponse, requestCreateProfile, requestLogin } from "../api/auth";
import { useAccountStore } from "../store/accountStore";
import { useLocation } from "wouter";
import form from "antd/es/form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { MenuBar } from "../common/MenuBar/MenuBar";

type LoginForm = { 
  mobile: string,
  password: string
}

export const LoginPage:FC = () => {
  const [form] = Form.useForm<LoginForm>();
  const {profile, setProfile} = useAccountStore();
  const [, navigate] = useLocation();

  const [creatingModal, setCreatingModal] = useState<boolean>(false);
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
    } else {
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
        password: formValues.password,
        studentList: studentRequest
      }
      const createProfileRequest = await requestCreateProfile<CreateProfileResponse>(createRequest);
      if(createProfileRequest.error) {
        openNotification("error", "Lỗi", getErrorText(createProfileRequest.error))
      } else if(createProfileRequest.items) {
        setProfile(createProfileRequest.items.user);
        saveSession(createProfileRequest.items.session);
        openNotification("success", "Thành công", "Tài khoản đã được tạo và đã đăng nhập.");
        navigate("/course");
      }
    }
    setCreatingModal(false);
  }

  const handleLogin = async(values:LoginForm) => {
    const checkLogin = await requestLogin<LoginResponse>(values.mobile, values.password);
    if(checkLogin.error) {
      openNotification("error", "Lỗi", getErrorText(checkLogin.error))
    } else if(checkLogin.items && checkLogin.items.user && checkLogin.items.session) {
      setProfile(checkLogin.items.user);
      saveSession(checkLogin.items.session);
      openNotification("success", "Thành công", "Đăng nhập thành công");
      navigate("/course");
    }
  }

  const toggleSignUp = () => {
    setTmpFormData({
      name: "",
      password: "",
      retypePassword: "",
      phone: "",
      gender: "",
      students: []
    })
  }
  const backToSignIn = () => {
    setTmpFormData(null)
  }

  return (
    <>
      <MenuBar />
      <div className="login-bg">
        {tmpFormData ? (
          <div className="login-box" style={{width: "800px"}}>
            <div className="login-title">Đăng ký tài khoản</div>
            <div className="login-form" style={{marginBottom: "15px"}}>
              <Button color="primary" variant="text" onClick={() => backToSignIn()}><FontAwesomeIcon icon={faChevronLeft} /> Quay lại đăng nhập</Button>
            </div>
            <UserFormComponent
              formType="register"
              defaultValues={tmpFormData}
              submitForm={(values) => handleCreateProfile(values)}
            />
          </div>
        ) : (
          <div className="login-box">
            <div className="login-title" style={{marginBottom: "15px"}}>Đăng nhập</div>
            <Form
              form={form}
              name="login"
              layout="vertical"
              onFinish={handleLogin}
              style={{ maxWidth: 360, margin: '0 auto' }}
            >
              <Form.Item
                label="Số điện thoại"
                name="mobile"
                rules={[
                  { required: true, message: 'Hãy nhập số điện thoại' },
                  { pattern: vietnamPhoneRegex, message: 'Số điện thoại không hợp lệ' },
                ]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>

              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[{ required: true, message: 'Hãy nhập mật khẩu' }]}
              >
                <Input.Password placeholder="Nhập mật khẩu" />
              </Form.Item>

              <Form.Item style={{marginBottom: "10px"}}>
                <Button type="primary" htmlType="submit" block>
                  Đăng nhập
                </Button>
              </Form.Item>
            </Form>
            <div className="login-form">
              <Button color="primary" variant="text" onClick={() => toggleSignUp()}>Đăng ký tài khoản</Button>
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