import { Button, Col, Collapse, CollapseProps, Modal, Row } from "antd";
import { FC, Fragment, useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./course.sass"
import { faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { CheckStudentResponse, CourseResponse, requestCheckStudent, requestCourseList, requestRegisterCourse } from "../../api/school";
import { convertDate, convertTime, formatPrice, getDay } from "../../utils/utils";
import { useAccountStore } from "../../store/accountStore";
import { RegisterResponse } from "../../api/auth";

type CourseItem = {
  course: CourseResponse,
  status?: string
}

export const CourseItemDetails:FC<CourseItem> = ({course, status}) => {
  return (
    <>
      <div className="item-header">
        <div className="header-left">
          <div className="item-content">
            <div className="item-title-container">
              <div className="item-title">
                <div className="title-text">{course.name}</div>
                {status ? (
                  <div className="item-tag">
                    {status === "confirmed" ? (
                      <div className="title-tag green">Đã xác minh</div>
                    ) : ""}
                    {status === "pending" ? (
                      <div className="title-tag orange">Đang xác minh</div>
                    ) : ""}
                    {status === "admin-pending" ? (
                      <div className="title-tag orange">Cần xác minh</div>
                    ) : ""}
                  </div>
                ) : ""}
              </div>
            </div>
            <div className="item-tag">
              {course.advanced_class ? (
                <div className="title-tag red">Chuyên</div>
              ) : ""}
              {course.has_started && !course.is_over ? (
                <div className="title-tag orange">Đã bắt đầu</div>
              ) : ""}
              {!course.has_started && !course.is_over ? (
                <div className="title-tag green">Sắp tới</div>
              ) : ""}
              {course.is_over ? (
                <div className="title-tag red">Đã kết thúc</div>
              ) : ""}
            </div>
          </div>
        </div>
        <div className="header-right">
          <div className="item-content">
            <div className="item-room">
              {course.room_name}
            </div>
            {course.slots_left ? (
              <div className="item-slots">
                Còn <b>{course.slots_left}</b> chỗ
              </div>
            ) : ""}
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

type StudentSelector = CheckStudentResponse & {
  selected: boolean
}
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
  const [studentSelector, setStudentSelector] = useState<StudentSelector[]>([]);

  useEffect(() => {
    getCourseList();
  }, [])
  const getCourseList = async() => {
    const course = await requestCourseList();
    if(course.items) {
      setCourseList(course.items)
    }
  }

  const openRegisterModal = async(course:CourseResponse) => {
    if(course && profile) {
      setSelectedCourse(course);
      setRegisterModal(true);
      setSelectedAtLeastOneStudent(false);
      const checkStudent = await requestCheckStudent<CheckStudentResponse[]>(course.id, profile.id);
      if(checkStudent.items) {
        let tmpStudentSelector:StudentSelector[] = [];
        checkStudent.items.forEach(student => {
          tmpStudentSelector.push({
            ...student,
            selected: false
          })
        })
        setStudentSelector(tmpStudentSelector);
      }
    }
  }
  const closeRegisterModal = () => {
    setRegisterModal(false);
  }

  const selectStudent = (student:StudentSelector) => {
    if(student.eligible === "yes") {
      setStudentSelector(prev =>
        prev.map(item =>
          item.student_id === student.student_id
            ? { ...item, selected: !item.selected }
            : item
        )
      )
    }
  }
  useEffect(() => {
    const findSelectedStudent = studentSelector.find(student => student.selected);
    if(findSelectedStudent) {
      setSelectedAtLeastOneStudent(true);
    } else {
      setSelectedAtLeastOneStudent(false);
    }
  }, [studentSelector])

  const handleRegister = async() => {
    if(studentSelector.length && selectedAtLeastOneStudent && selectedCourse && profile) {
      setLoadingMessage("Đang đăng ký");
      setRegisterModal(false);
      setLoadingModal(true);
      let studentList:string[] = [];
      studentSelector.forEach(student => {
        if(student.selected && student.eligible === "yes") {
          studentList.push(student.student_id);
        }
      })
      const registerRes = await requestRegisterCourse<RegisterResponse>(selectedCourse.id, studentList, profile.id);
      setLoadingModal(false);
      if(registerRes.items && registerRes.items.transaction) {
        setTransactionInfo(registerRes.items);
        setTransactionModal(true);
      } else if (registerRes.error) {
        console.log(registerRes.error)
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
                <CourseItemDetails course={course} />
              </div>
            </Col>
          )
        })}
      </Row>
      <Modal
        title="Đăng ký khoá học"
        open={registerModal}
        footer={[
          <Button key="back" onClick={closeRegisterModal}>
            Huỷ
          </Button>,
          <Button key="submit" type="primary" disabled={!selectedAtLeastOneStudent} onClick={() => handleRegister()}>
            Đăng ký
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
          <div className="student-selector">
            <div className="selector-title">
              Chọn học sinh tham gia khoá học
            </div>
            {studentSelector.length ? (
              <div className="selector-list">
                <Row gutter={[16,16]}>
                  {studentSelector.map(student => {
                    let getSelectorClass = "";
                    let errorDesc = "";
                    switch (student.eligible) {
                      case "no":
                        getSelectorClass = "invalid";
                        errorDesc = "Khối không phù hợp"
                        break;
                      case "registered":
                        getSelectorClass = "disabled";
                        errorDesc = "Đã đăng ký"
                        break;
                      case "registered-other-course":
                        getSelectorClass = "invalid";
                        errorDesc = "Đã đăng ký khoá học khác"
                        break;
                    
                      default:
                        break;
                    }
                    return (
                      <Col xs={24} sm={12} key={student.student_id}>
                        <div className={`list-item ${getSelectorClass} ${student.selected ? "selected" : ""}`} onClick={() => selectStudent(student)}>
                          <div className="list-info">
                            <div className="info-name">{student.student_name}</div>
                            <div className="info-desc">Khối {student.grade_name}</div>
                            {errorDesc && <div className="info-error">&nbsp;- {errorDesc}</div>}
                          </div>
                          <div className="list-icon">
                            {student.selected && <FontAwesomeIcon icon={faCircleCheck} />}
                            {errorDesc && <FontAwesomeIcon icon={faCircleXmark} />}
                          </div>
                        </div>
                      </Col>
                    )
                  })}
                </Row>
              </div>
            ) : (
              <div className="modal-loading">
                <div className="loading-icon"></div>
                <div className="loading-text">
                  Đang kiểm tra học sinh
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
      <Modal
        open={loadingModal}
        width={500}
        closable={false}
        footer={null}
        centered
      >
        <div className="modal-loading">
          <div className="loading-icon"></div>
          <div className="loading-text">
            {loadingMessage}
          </div>
        </div>
      </Modal>
      <Modal
        open={transactionModal}
        footer={[
          <Button key="back" type="primary" onClick={() => setTransactionModal(false)}>
            Đóng
          </Button>,
        ]}
        onCancel={() => setTransactionModal(false)}
        width={800}
        centered
      >
        {transactionInfo && transactionInfo.transaction ? (
          <div className="modal-scroll-container">
            <div className="modal-center-title">Đăng ký thành công</div>
            {selectedCourse ? (
              <div className="modal-list">
                <div className="list-item">
                  <b>Lớp đăng ký:</b> {selectedCourse.name}
                </div>
                <div className="list-item">
                  <b>Thời gian khoá học:</b> Từ {convertDate(selectedCourse.start_date)} {selectedCourse.end_date && (<Fragment>đến {convertDate(selectedCourse.end_date)}</Fragment>)}
                </div>
                <div className="list-item">
                  <b>Học sinh:</b>&nbsp;
                  <span className="item-student">
                    {studentSelector.map((student, index) => {
                      if(student.selected) {
                        return (
                          <span key={index}>{student.student_name}</span>
                        )
                      }
                    })}
                  </span>
                </div>
              </div>
            ) : ""}
            <div className="modal-center-title">Học phí cần thanh toán</div>
            <div className="modal-center-desc-price">{formatPrice(transactionInfo.transaction.fee)}đ</div>
            <div className="modal-center-title">Thông tin chuyển khoản</div>
            <div className="modal-center-desc">Trong vòng 48 giờ sau khi đăng kí, quý phụ huynh chuyển khoản vào một trong hai số tài khoản dưới. Nội dung chuyển khoản ghi rõ: <b>HỌ TÊN HỌC SINH - LỚP ĐANG HỌC - LỚP ĐĂNG KÍ (Ví dụ: NGUYỄN VĂN AN - 9A2 - 9B)</b>. Sau khi chuyển khoản thành công, quý phụ huynh hãy chụp ảnh màn hình và gửi Zalo cho một trong hai thầy để xác nhận. <b>Hệ thống sẽ tự động hủy đăng kí sau 48 giờ nếu không được xác nhận.</b></div>
            <Row gutter={[16, 16]} style={{marginTop: "10px"}}>
              <Col xs={24} sm={12}>
                <div className="modal-list">
                  <div className="list-item">
                    <b>Ngân hàng:</b> Techcombank
                  </div>
                  <div className="list-item">
                    <b>Tên tài khoản:</b> NGUYỄN LƯƠNG TÙNG
                  </div>
                  <div className="list-item">
                    <b>Số tài khoản:</b> 1903 6395 7890 10
                  </div>
                  <div className="list-item">
                    <b>Mã giao dịch:</b> {transactionInfo.transaction.id}
                  </div>
                  <div className="list-item">
                    <b>Số điện thoại/Zalo:</b> 0844548880
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div className="modal-list">
                  <div className="list-item">
                    <b>Ngân hàng:</b> Argribank
                  </div>
                  <div className="list-item">
                    <b>Tên tài khoản:</b> PHAN HUY BÃO
                  </div>
                  <div className="list-item">
                    <b>Số tài khoản:</b> 1606 2054 1957 0
                  </div>
                  <div className="list-item">
                    <b>Mã giao dịch:</b> {transactionInfo.transaction.id}
                  </div>
                  <div className="list-item">
                    <b>Số điện thoại/Zalo:</b> 0909820852
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        ) : ""}
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