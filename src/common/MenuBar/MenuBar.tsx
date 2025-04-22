import { Button } from "antd";
import "./menu.sass"
import { FC } from "react";

export const MenuBar:FC = () => {
  return (
    <div className="main-navbar">
      <div className="top-navbar">
        <div className="navbar-left">
          <div className="nav-item">
            <div className="item-title">Lớp học Mr.Tùng</div>
          </div>
        </div>
        <div className="navbar-right">
          <div className="nav-item">
            <Button color="primary" variant="solid">
              Đăng ký khoá học
            </Button>
            <Button color="primary" variant="text">
              Liên hệ
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}