
import { FC, useEffect } from "react";
import { getErrorText, saveAdminSession, saveSession } from "../utils/utils";
import { Button, Form, Input, Modal, notification } from "antd";
import { useAccountStore } from "../store/accountStore";
import { useLocation } from "wouter";
import { MenuBar } from "../common/MenuBar/MenuBar";
import { AdminLoginResponse, requestAdminLogin } from "../api/admin";

type LoginForm = { 
  username: string,
  password: string
}

export const AdminLoginPage:FC = () => {
  const [form] = Form.useForm<LoginForm>();
  const {adminProfile, setAdminProfile} = useAccountStore();
  const [, navigate] = useLocation();

  useEffect(() => {
    if(adminProfile) {
      navigate("/tung-siu-vip-pro/course");
    }
  }, [adminProfile])

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

  const handleLogin = async(values:LoginForm) => {
    const checkLogin = await requestAdminLogin<AdminLoginResponse>(values.username, values.password);
    if(checkLogin.error) {
      openNotification("error", "Lỗi", getErrorText(checkLogin.error))
    } else if(checkLogin.items && checkLogin.items.userId) {
      setAdminProfile(checkLogin.items.userId);
      saveAdminSession(checkLogin.items.userId);
      openNotification("success", "Thành công", "Đăng nhập thành công");
      navigate("/tung-siu-vip-pro/course");
    }
  }

  return (
    <>
      <MenuBar />
      <div className="login-bg">
        <div className="login-box">
          <div className="login-title" style={{marginBottom: "15px"}}>Đăng nhập Admin</div>
          <Form
            form={form}
            name="login"
            layout="vertical"
            onFinish={handleLogin}
            style={{ maxWidth: 360, margin: '0 auto' }}
          >
            <Form.Item
              label="Tên người dùng"
              name="username"
              rules={[
                { required: true, message: 'Hãy nhập tên người dùng' },
              ]}
            >
              <Input placeholder="Nhập tên người dùng" />
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
        </div>
      </div>
    </>
  )
}