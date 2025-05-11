import { FC, useEffect, useState } from "react";
import { MenuBar } from "../common/MenuBar/MenuBar";
import { useAccountStore } from "../store/accountStore";
import { CourseResponse, MyCourseResponse, requestMyCourse } from "../api/school";
import { Row, Col, Button, Modal } from "antd";
import { CourseItemDetails } from "../modules/Course/CourseList";
import "../modules/Course/course.sass"
import { formatPrice } from "../utils/utils";

type MyCourse = {
  course: CourseResponse,
  studentList: string,
  fee: number,
  transaction_id: string,
  status: string
}

export const MyCoursePage:FC = () => {
  const {profile} = useAccountStore();
  const [myCourse, setMyCourse] = useState<MyCourse[]>([]);
  const [courseInfoModal, setCourseInfoModal] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<MyCourse | null>(null);

  const getMyCourse = async() => {
    if(profile) {
      const myCourseRes = await requestMyCourse<MyCourseResponse[]>(profile.id);
      if(myCourseRes.items) {
        let uniqueCourseIds:string[] = [];
        myCourseRes.items.forEach(course => {
          if(!uniqueCourseIds.includes(course.id)) {
            uniqueCourseIds.push(course.id);
          }
        })
        let tmpMyCourse:MyCourse[] = [];
        uniqueCourseIds.forEach(courseId => {
          if(myCourseRes.items) {
            const getCourses = myCourseRes.items.filter(course => course.id === courseId);
            let tmpFee = 0;
            let tmpStudentList:string[] = [];
            getCourses.forEach(courseFilter => {
              if(courseFilter.status === "pending") {
                tmpFee += courseFilter.fee_amount;
              }
              tmpStudentList.push(courseFilter.student_name);
            })
            if(getCourses[0]) {
              const tmpCourse:CourseResponse = {
                id: getCourses[0].id,
                name: getCourses[0].name,
                room_name: getCourses[0].room_name,
                advanced_class: getCourses[0].advanced_class,
                start_date: getCourses[0].start_date,
                end_date: getCourses[0].end_date,
                description: getCourses[0].description,
                day: getCourses[0].day,
                start_time: getCourses[0].start_time,
                end_time: getCourses[0].end_time,
                has_started: getCourses[0].has_started,
                is_over: getCourses[0].is_over,
              };
              tmpMyCourse.push({
                course: tmpCourse,
                studentList: tmpStudentList.join(", "),
                fee: tmpFee,
                transaction_id: getCourses[0].transaction_id,
                status: getCourses[0].status
              })
            }
          }
        })
        setMyCourse(tmpMyCourse)
      }
    }
  }

  const openCourseInfoModal = (course:MyCourse) => {
    setSelectedCourse(course);
    setCourseInfoModal(true);
  }

  useEffect(() => {
    getMyCourse();
  }, [])

  return (
    <>
      <MenuBar />
      <div className="main-container">
        <div className="main-title">Khoá học đã đăng ký</div>
        <Row gutter={[16, 16]}>
          {myCourse.map(course => {
            return (
              <Col xs={24} sm={12} xl={8} key={course.course.id}>
                <div className="course-item" onClick={() => {openCourseInfoModal(course)}}>
                  <CourseItemDetails course={course.course} status={course.status} />
                </div>
              </Col>
            )
          })}
        </Row>
      </div>
      <Modal
        title="Thông tin khoá học"
        open={courseInfoModal}
        footer={[
          <Button key="back" type="primary" onClick={() => setCourseInfoModal(false)}>
            Đóng
          </Button>,
        ]}
        onCancel={() => setCourseInfoModal(false)}
        width={800}
        centered
      >
        {selectedCourse ? (
          <div className="modal-scroll-container">
            <div className="course-modal">
              <CourseItemDetails course={selectedCourse.course} status={selectedCourse.status} />
              <div className="item-body">
                <div className="info-content">
                  <div className="content-title">Học sinh</div>
                  <div className="content-desc">{selectedCourse.studentList}</div>
                </div>
              </div>
            </div>
            {selectedCourse.status === "pending" ? (
              <>
                <div className="modal-center-title">Cần thanh toán</div>
                <div className="modal-center-desc-price">{formatPrice(selectedCourse.fee)}đ</div>
                <div className="modal-center-title">Thông tin chuyển khoản</div>
                <div className="modal-center-desc">Quý phụ huynh hãy chuyển khoản vào một trong hai số tài khoản sau</div>
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
                        <b>Nội dung chuyển khoản:</b> {selectedCourse.transaction_id}
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
                        <b>Nội dung chuyển khoản:</b> {selectedCourse.transaction_id}
                      </div>
                      <div className="list-item">
                        <b>Số điện thoại/Zalo:</b> 0909820852
                      </div>
                    </div>
                  </Col>
                </Row>
              </>
            ) : ""}
          </div>
        ) : ""}
      </Modal>
    </>
  )
}