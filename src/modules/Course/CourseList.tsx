import { Col, Collapse, CollapseProps, Modal, Row } from "antd";
import { FC, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./course.sass"
import { faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";

const CourseItems:FC = () => {
  const test = [1,1,1,1,1,1];
  const [registerModal, setRegisterModal] = useState<boolean>(false);

  const openRegisterModal = () => {
    setRegisterModal(true);
  }
  const closeRegisterModal = () => {
    setRegisterModal(false);
  }

  return (
    <>
      <Row gutter={[16, 16]}>
        {test.map(item => {
          return (
            <Col xs={24} sm={12} xl={8}>
              <div className="course-item" onClick={() => {openRegisterModal()}}>
                <div className="item-header">
                  <div className="header-left">
                    <div className="item-content">
                      <div className="item-title">
                        Lớp 9A
                      </div>
                      <div className="item-tag">
                        <div className="title-tag red">Chuyên</div>
                        <div className="title-tag">2.500.000đ</div>
                        <div className="title-tag green">Sắp tới</div>
                      </div>
                    </div>
                  </div>
                  <div className="header-right">
                    <div className="item-content">
                      <div className="item-room">
                        Phòng <b>202</b>
                      </div>
                      <div className="item-slots">
                        Còn <b>999</b> chỗ
                      </div>
                    </div>
                  </div>
                </div>
                <div className="item-body">
                  <div className="info-content">
                    <div className="content-title">Mô tả</div>
                    <div className="content-desc limit-desc">Đây là khoá học khoa học tự nhiên siêu cấp VIP Pro có thể cân mọi kỳ thi đạt điểm cao. Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel delectus dignissimos doloremque autem rerum cupiditate quam ex sequi praesentium. Esse quisquam alias accusantium magnam, perspiciatis ipsam repudiandae doloribus distinctio cum.</div>
                    <div className="content-title">Thời gian khoá học</div>
                    <div className="content-desc">Từ <b>01/08/2025</b> đến <b>01/10/2025</b></div>
                    <div className="content-title">Thời gian học</div>
                    <div className="content-desc">
                      Thứ 2: từ <b>18:00</b> đến <b>20:00</b>
                      <br />Thứ 4: từ <b>16:00</b> đến <b>18:00</b>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          )
        })}
      </Row>
      <Modal
        title="Đăng ký khoá học"
        open={registerModal}
        onOk={() => closeRegisterModal()}
        onCancel={() => closeRegisterModal()}
        okText="Đăng ký"
        cancelText="Huỷ"
        width={800}
        centered
      >
        <div className="modal-scroll-container">
          <div className="modal-scroll-container">
            <div className="course-modal" onClick={() => {openRegisterModal()}}>
              <div className="item-header">
                <div className="header-left">
                  <div className="item-content">
                    <div className="item-title">
                      Lớp 9A
                    </div>
                    <div className="item-tag">
                      <div className="title-tag red">Chuyên</div>
                      <div className="title-tag">2.500.000đ</div>
                      <div className="title-tag green">Sắp tới</div>
                    </div>
                  </div>
                </div>
                <div className="header-right">
                  <div className="item-content">
                    <div className="item-room">
                      Phòng <b>202</b>
                    </div>
                    <div className="item-slots">
                      Còn <b>999</b> chỗ
                    </div>
                  </div>
                </div>
              </div>
              <div className="item-body">
                <div className="info-content">
                  <div className="content-title">Mô tả</div>
                  <div className="content-desc">Đây là khoá học khoa học tự nhiên siêu cấp VIP Pro có thể cân mọi kỳ thi đạt điểm cao. Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel delectus dignissimos doloremque autem rerum cupiditate quam ex sequi praesentium. Esse quisquam alias accusantium magnam, perspiciatis ipsam repudiandae doloribus distinctio cum.</div>
                  <div className="content-title">Thời gian khoá học</div>
                  <div className="content-desc">Từ <b>01/08/2025</b> đến <b>01/10/2025</b></div>
                  <div className="content-title">Thời gian học</div>
                  <div className="content-desc">
                    Thứ 2: từ <b>18:00</b> đến <b>20:00</b>
                    <br />Thứ 4: từ <b>16:00</b> đến <b>18:00</b>
                  </div>
                </div>
              </div>
            </div>
            <div className="student-selector">
              <div className="selector-title">
                Chọn học sinh tham gia khoá học
              </div>
              <div className="selector-list">
                <Row gutter={[16,16]}>
                  <Col xs={24} sm={12}>
                    <div className="list-item">
                      <div className="list-info">
                        <div className="info-name">Nguyễn Văn A</div>
                        <div className="info-desc">Khối 9</div>
                      </div>
                      <div className="list-icon">
                        <FontAwesomeIcon icon={faCircleCheck} />
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} sm={12}>
                    <div className="list-item selected">
                      <div className="list-info">
                        <div className="info-name">Nguyễn Văn A1</div>
                        <div className="info-desc">Khối 9</div>
                      </div>
                      <div className="list-icon">
                        <FontAwesomeIcon icon={faCircleCheck} />
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} sm={12}>
                    <div className="list-item disabled">
                      <div className="list-info">
                        <div className="info-name">Nguyễn Văn B</div>
                        <div className="info-desc">Khối 9</div>
                        <div className="info-error">&nbsp;- Đã đăng ký</div>
                      </div>
                      <div className="list-icon"></div>
                    </div>
                  </Col>
                  <Col xs={24} sm={12}>
                    <div className="list-item invalid">
                      <div className="list-info">
                        <div className="info-name">Nguyễn Văn C</div>
                        <div className="info-desc">Khối 6</div>
                        <div className="info-error">&nbsp;- Khối không phù hợp</div>
                      </div>
                      <div className="list-icon">
                        <FontAwesomeIcon icon={faCircleXmark} />
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export const CourseListComponent:FC = () => {
  const subjectList: CollapseProps['items'] = [
    {
      key: '1',
      label: 'Khoa học tự nhiên',
      children: <CourseItems />,
    },
    {
      key: '2',
      label: 'Toán',
      children: <CourseItems />,
    }
  ];
  return (
    <Collapse items={subjectList} defaultActiveKey={['1']}  />
  )
}