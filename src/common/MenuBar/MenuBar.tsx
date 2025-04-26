import { Button } from "antd";
import "./menu.sass"
import { FC } from "react";
import { Link } from "wouter";

export const MenuBar:FC = () => {
  return (
    <div className="main-navbar">
      <div className="top-navbar">
        <div className="navbar-left">
          <div className="nav-item">
            <div className="item-title">BTGROUP</div>
          </div>
        </div>
        <div className="navbar-right">
          <div className="nav-item">
            <Button color="primary" variant="solid">
              Đăng ký khoá học
            </Button>
            <Button color="primary" variant="text">
              Quản lý thông tin
            </Button>
            <Link to="login">
              <Button color="primary" variant="text">
                Đăng nhập
              </Button>
            </Link>
            <Button color="primary" variant="text">
              Liên hệ
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}