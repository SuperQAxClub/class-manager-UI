import { Button, Dropdown, MenuProps } from "antd";
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
          Quản lý thông tin
        </Link>
      ),
      key: '0',
    },
    {
      label: (
        <Link to="my-course">
          Khoá học đã đăng ký
        </Link>
      ),
      key: '1',
    },
    {
      label: (
        <a onClick={() => signOut()}>
          Đăng xuất
        </a>
      ),
      key: '2',
    }
  ];

  return (
    <div className="main-navbar">
      <div className="top-navbar">
        <div className="navbar-left">
          <div className="nav-item">
            <Link to="/">
              <div className="item-title">BTGroup</div>
            </Link>
          </div>
        </div>
        <div className="navbar-right">
          <div className="nav-item">
            <Link to="course">
              <Button color="primary" variant="solid">
                Đăng ký khoá học
              </Button>
            </Link>
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