import { FC, Fragment, useEffect, useState } from "react";
import { CourseItemDetails } from "../modules/Course/CourseList";
import { MenuBar } from "../common/MenuBar/MenuBar";
import { useAccountStore } from "../store/accountStore";
import { useLocation } from "wouter";
import { Button, Col, Collapse, CollapseProps, Modal, notification, Popconfirm, Row, Tag } from "antd";
import { CourseResponse } from "../api/school";
import { convertDate, convertFullDateTime, formatPrice, formatTimeDifference, getGender } from "../utils/utils";
import { CourseRegistrationResponse, requestAdminCourseList, requestAdminCourseRegistration, requestAdminCourseRegistrationStatusUpdate } from "../api/admin";
import "../modules/Course/course.sass";
import { isAfter, isBefore } from "date-fns";

const CourseItems:FC = () => {
  const [, navigate] = useLocation();
  const {adminProfile} = useAccountStore();
  const [courseInfoModal, setCourseInfoModal] = useState<boolean>(false);
  const [courseList, setCourseList] = useState<CourseResponse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseResponse | null>(null);
  const [registrationList, setRegistrationList] = useState<CourseRegistrationResponse[]>([])

  useEffect(() => {
    if(adminProfile) {
      getCourseList();
    } else {
      navigate("/tung-siu-vip-pro")
    }
  }, [])
  const getCourseList = async() => {
    const course = await requestAdminCourseList();
    if(course.items) {
      setCourseList(course.items)
    }
  }

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

  const openRegisterModal = async(course:CourseResponse) => {
    if(course) {
      setSelectedCourse(course);
      setCourseInfoModal(true);
      const registration = await requestAdminCourseRegistration<CourseRegistrationResponse[]>(course.id);
      if(registration.items) {
        setRegistrationList(registration.items);
      }
    }
  }
  const closeRegisterModal = () => {
    setCourseInfoModal(false);
  }

  const handleStudentStatus = async(regId:string, status:string) => {
    if(selectedCourse) {
      const updatedCourse = await requestAdminCourseRegistrationStatusUpdate<CourseRegistrationResponse[]>(regId, status, selectedCourse.id);
      if(updatedCourse.items) {
        setRegistrationList(updatedCourse.items);
        if(status === "confirmed") openNotification("success", "Thành công", "Đã xác nhận học sinh");
        if(status === "cancelled") openNotification("success", "Thành công", "Đã huỷ đăng ký học sinh");
      }
    }
  }

  return (
    <>
      <Row gutter={[16, 16]}>
        {courseList.map(course => {
          return (
            <Col xs={24} sm={12} xl={8} key={course.id}>
              <div className="course-item" onClick={() => {openRegisterModal(course)}}>
                <CourseItemDetails course={course} status={course.pending_confirmation ? "admin-pending" : ""} />
              </div>
            </Col>
          )
        })}
      </Row>
      <Modal
        title="Thông tin khoá học"
        open={courseInfoModal}
        footer={[
          <Button key="back" type="primary" onClick={closeRegisterModal}>
            Đóng
          </Button>,
        ]}
        onCancel={closeRegisterModal}
        width={800}
        centered
      >
        <div className="modal-scroll-container">
          <div className="course-modal">
            {selectedCourse ? (
              <Fragment>
                <CourseItemDetails course={selectedCourse} />
                <div className="registration-container">
                  {registrationList.map((reg) => {
                    let totalFee = 0;
                    reg.studentList.forEach(student => {
                      totalFee += student.fee;
                    })
                    return (
                      <div className="reg-parent" key={reg.parentMobile}>
                        <div className="parent-info">
                          <div className="info-basic">
                            <span className="title-tag">Phụ huynh</span>
                            <span className="parent-name">{reg.parentName}</span>
                            <span className="parent-other">, {getGender(reg.parentGender)} - {reg.parentMobile}</span>
                          </div>
                          <div className="info-status">
                            <div className="status-fee">
                              Tổng học phí: <b>{formatPrice(totalFee)} đ</b>
                            </div>
                          </div>
                        </div>
                        <div className="student-list">
                          {reg.studentList.map(student => {
                            return (
                              <div className="student-item" key={student.regId}>
                                <div className="student-info">
                                  <div className="student-header">
                                    {student.status === "pending" ? (
                                      <div className="item-tag title-tag orange">Đang chờ</div>
                                    ) : ""}
                                    {student.status === "confirmed" ? (
                                      <div className="item-tag title-tag green">Đã xác nhận</div>
                                    ) : ""}
                                    {student.class? (
                                      <div className="item-tag title-tag">Lớp {student.class}</div>
                                    ) : ""}
                                    <div className="item-school">{student.school ? student.school : "Trường khác"}</div>
                                  </div>
                                  <div className="student-name">
                                    Tên học sinh: <b>{student.name}</b>, {getGender(student.gender)}
                                  </div>
                                  <div className="student-date">
                                    Thời gian đăng ký: <b>{convertFullDateTime(student.created)}</b> {isAfter(new Date(), new Date(student.created)) ? `(${formatTimeDifference(new Date(student.created), new Date())} trước)` : ""}
                                  </div>
                                  <div className="student-transaction">
                                    Mã giao dịch: <b>{student.transactionId}</b>
                                  </div>
                                  <div className="student-fee">
                                    Cần thanh toán: <b>{formatPrice(student.fee)} đ</b>
                                  </div>
                                </div>
                                <div className="student-action">
                                  {student.status === "pending" ? (
                                    <Popconfirm
                                      title="Xác nhận đã thanh toán?"
                                      onConfirm={() => handleStudentStatus(student.regId, "confirmed")}
                                      okText="Xác nhận"
                                      cancelText="Huỷ"
                                    >
                                      <Button color="green" variant="solid">Xác nhận</Button>
                                    </Popconfirm>
                                  ) : ""}
                                  <Popconfirm
                                    title="Huỷ đăng ký?"
                                    onConfirm={() => handleStudentStatus(student.regId, "cancelled")}
                                    okText="Xác nhận"
                                    cancelText="Huỷ"
                                  >
                                    <Button color="danger" variant="outlined">Huỷ</Button>
                                  </Popconfirm>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Fragment>
            ) : ""}
          </div>
        </div>
      </Modal>
    </>
  )
}

export const AdminCourseManager:FC = () => {
  const subjectList: CollapseProps['items'] = [
    {
      key: '1',
      label: 'Khoa học tự nhiên',
      children: <CourseItems />,
    },
  ];

  return (
    <>
      <MenuBar />
      <div className="main-container">
        <Collapse items={subjectList} defaultActiveKey={['1']}  />
      </div>
    </>
  )
}