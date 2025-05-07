import { Col, Collapse, CollapseProps, Modal, Row } from "antd";
import { FC, Fragment, useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./course.sass"
import { faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { CourseResponse, requestCourseList } from "../../api/school";
import { convertDate, convertTime, formatPrice, getDay } from "../../utils/utils";

type CourseItem = {
  course: CourseResponse
}

const CourseItemDetails:FC<CourseItem> = ({course}) => {
  return (
    <>
      <div className="item-header">
        <div className="header-left">
          <div className="item-content">
            <div className="item-title">
              {course.name}
            </div>
            <div className="item-tag">
              {course.advanced_class && (
                <div className="title-tag red">Chuyên</div>
              )}
              <div className="title-tag">{formatPrice(course.fee)} đ{course.advanced_class && "/tháng"}</div>
              {course.has_started && (
                <div className="title-tag orange">Đã bắt đầu</div>
              )}
              {!course.has_started && (
                <div className="title-tag green">Sắp tới</div>
              )}
            </div>
          </div>
        </div>
        <div className="header-right">
          <div className="item-content">
            <div className="item-room">
              {course.room_name}
            </div>
            <div className="item-slots">
              Còn <b>{course.slots_left}</b> chỗ
            </div>
          </div>
        </div>
      </div>
      <div className="item-body">
        <div className="info-content">
          {course.description ? (
            <>
              <div className="content-title">Mô tả</div>
              <div className="content-desc">{course.description}</div>
            </>
          ) : ""}
          <div className="content-title">Thời gian khoá học</div>
          <div className="content-desc">Từ <b>{convertDate(course.start_date)}</b> {course.end_date && (
            <Fragment>đến <b>{convertDate(course.end_date)}</b></Fragment>
          )}</div>
          <div className="content-title">Thời gian học</div>
          <div className="content-desc">
            <b>{getDay(course.day)}</b>: từ <b>{convertTime(course.start_time)}</b> đến <b>{convertTime(course.end_time)}</b>
          </div>
        </div>
      </div>
    </>
  )
}

const CourseItems:FC = () => {
  const [registerModal, setRegisterModal] = useState<boolean>(false);
  const [courseList, setCourseList] = useState<CourseResponse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseResponse | null>(null);

  useEffect(() => {
    getCourseList();
  }, [])
  const getCourseList = async() => {
    const course = await requestCourseList();
    console.log(course.items)
    if(course.items) {
      setCourseList(course.items)
    }
  }

  const openRegisterModal = (course:CourseResponse) => {
    setSelectedCourse(course);
    setRegisterModal(true);
  }
  const closeRegisterModal = () => {
    setRegisterModal(false);
  }

  return (
    <>
      <Row gutter={[16, 16]}>
        {courseList.map(course => {
          return (
            <Col xs={24} sm={12} xl={8} key={course.id}>
              <div className="course-item" onClick={() => {openRegisterModal(course)}}>
                <CourseItemDetails course={course} />
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
            <div className="course-modal">
              {selectedCourse ? (
                <CourseItemDetails course={selectedCourse} />
              ) : ""}
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
  ];
  return (
    <Collapse items={subjectList} defaultActiveKey={['1']}  />
  )
}