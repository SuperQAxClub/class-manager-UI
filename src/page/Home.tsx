import { FC } from "react";
import { MenuBar } from "../common/MenuBar/MenuBar";
import { Button, Col, Row } from "antd";
import { Link } from "wouter";

export const HomePage:FC = () => {
  return (
    <>
      <MenuBar />
      <div className="main-container">
        <Row gutter={16}>
          <Col xs={24} sm={14}>
            <div className="home-content">
              <div className="content-text">
                <div className="text-title">Chào mừng đến với BTGroup</div>
                <div className="text-address">Địa chỉ: 71B Hùng Vương, Phường 4, Quận 5, TP.HCM</div>
                <div className="text-desc">Lớp bồi dưỡng kiến thức Khoa Học Tự Nhiên Lớp 6, 7, 8 và 9.</div>
              </div>
              <div className="content-signup">
                <Link to="course">
                  <Button type="primary" size="large">Đăng ký khoá học</Button>
                </Link>
              </div>
              <div className="content-bottom">
                <Button type="primary" size="large">Thời khoá biểu</Button>
                <Button type="primary" size="large">Giáo viên phụ trách</Button>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={10}>
            <div className="home-hero-center">
              <img src="/btg-home-hero.png" />
            </div>
          </Col>
        </Row>
      </div>
    </>
  )
}