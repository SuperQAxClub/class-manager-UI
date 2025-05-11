import { FC, Fragment, useEffect, useState } from "react";
import { CourseItemDetails, CourseListComponent } from "../modules/Course/CourseList";
import { MenuBar } from "../common/MenuBar/MenuBar";
import { useAccountStore } from "../store/accountStore";
import { useLocation } from "wouter";
import { Button, Col, Collapse, CollapseProps, Modal, Row } from "antd";
import { RegisterResponse } from "../api/auth";
import { CourseResponse, requestCourseList } from "../api/school";
import { convertDate, formatPrice } from "../utils/utils";
import { requestAdminCourseList } from "../api/admin";

const CourseItems:FC = () => {
  const {profile} = useAccountStore();
  const [registerModal, setRegisterModal] = useState<boolean>(false);
  const [loadingModal, setLoadingModal] = useState<boolean>(false);
  const [transactionModal, setTransactionModal] = useState<boolean>(false);
  const [transactionInfo, setTransactionInfo] = useState<RegisterResponse | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [selectedAtLeastOneStudent, setSelectedAtLeastOneStudent] = useState<boolean>(false);
  const [courseList, setCourseList] = useState<CourseResponse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseResponse | null>(null);

  useEffect(() => {
    getCourseList();
  }, [])
  const getCourseList = async() => {
    const course = await requestAdminCourseList();
    if(course.items) {
      setCourseList(course.items)
    }
  }

  const openRegisterModal = async(course:CourseResponse) => {
    if(course) {
      setSelectedCourse(course);
      setRegisterModal(true);
    }
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
                <CourseItemDetails course={course} status={course.pending_confirmation ? "admin-pending" : ""} />
              </div>
            </Col>
          )
        })}
      </Row>
      <Modal
        title="Đăng ký khoá học"
        open={registerModal}
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
              <CourseItemDetails course={selectedCourse} />
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