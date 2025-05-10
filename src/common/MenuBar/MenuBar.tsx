import { Button, Dropdown, MenuProps, Space } from "antd";
import "./menu.sass"
import { FC } from "react";
import { Link, useLocation } from "wouter";
import { useAccountStore } from "../../store/accountStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { removeSession } from "../../utils/utils";

export const MenuBar:FC = () => {
  const {profile, setProfile} = useAccountStore();
  const [, navigate] = useLocation();

  const signOut = () => {
    setProfile(null);
    removeSession();
    navigate("/login");
  }

  const items: MenuProps['items'] = [
    {
      label: (
        <Link to="profile">
          Quản lý
        </Link>
      ),
      key: '0',
    },
    {
      label: (
        <a onClick={() => signOut()}>
          Đăng xuất
        </a>
      ),
      key: '1',
    }
  ];

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
            <Link to="course">
              <Button color="primary" variant="solid">
                Đăng ký khoá học
              </Button>
            </Link>
            <Button color="primary" variant="text">
              Liên hệ
            </Button>
            {profile ? (
              <Dropdown menu={{ items }} trigger={['click']}>
                <Button color="primary" variant="text" iconPosition="end" icon={<FontAwesomeIcon icon={faChevronDown} />}>
                  Tài khoản
                </Button>
              </Dropdown>
            ) : ""}
          </div>
        </div>
      </div>
    </div>
  )
}