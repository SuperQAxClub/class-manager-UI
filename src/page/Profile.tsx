import { FC, useEffect, useState } from "react";
import { MenuBar } from "../common/MenuBar/MenuBar";
import { ParentFormValues, Student, UserFormComponent } from "../modules/Profile/UserForm";
import { useLocation } from "wouter";
import { useAccountStore } from "../store/accountStore";
import { getSession } from "../utils/utils";
import { requestStudents, requestUpdateProfile, StatusResponse, StudentResponse, UpdateProfileRequest, UpdateProfileStudentRequest } from "../api/auth";
import { notification } from "antd";

export const ProfilePage:FC = () => {
  const {profile} = useAccountStore();
  const [, navigate] = useLocation();
  const [tmpFormData, setTmpFormData] = useState<ParentFormValues | null>(null);

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

  const getStudents = async() => {
    const session = getSession();
    if(session && profile) {
      const studentList = await requestStudents<StudentResponse[]>(session.id);
      if(studentList.items) {
        let tmpStudents:Student[] = [];
        studentList.items.forEach(student => {
          tmpStudents.push({
            id: student.id,
            school: student.school_id || "other",
            grade: student.grade_id,
            gender: student.gender,
            studentCode: student.student_code || "",
            class: student.class_id || "",
            studentName: student.name
          })
        })
        const tmpFormData:ParentFormValues = {
          name: profile.name,
          gender: profile.gender,
          phone: profile.mobile,
          students: tmpStudents
        }
        setTmpFormData(tmpFormData);
      }
    }
  }
  const handleUpdateProfile = async(formValues:ParentFormValues) => {
    if(!formValues.students.length) {
      openNotification("error", "Thiếu học sinh", "Hãy khai báo ít nhất 1 học sinh!")
    } else if(profile) {
      let studentRequest:UpdateProfileStudentRequest[] = [];
      formValues.students.forEach(student => {
        studentRequest.push({
          id: student.id || null,
          name: student.studentName,
          schoolId: student.school === "other" ? null : student.school,
          classId: student.class || null,
          studentCode: student.studentCode || null,
          gender: student.gender,
          gradeId: student.grade
        })
      })
      const updateRequest:UpdateProfileRequest = {
        id: profile.id,
        name: formValues.name,
        mobile: formValues.phone,
        gender: formValues.gender,
        studentList: studentRequest
      }
      console.log(updateRequest)
      const updateProfileRequest = await requestUpdateProfile<StatusResponse>(updateRequest);
      if(updateProfileRequest.error) {
        openNotification("error", "Lỗi", "Đã xảy ra lỗi khi cập nhật thông tin")
      } else if(updateProfileRequest.items) {
        openNotification("success", "Thành công", "Thông tin đã được cập nhật.");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    }
  }

  useEffect(() => {
    if(profile) {
      getStudents();
    } else {
      navigate("/login");
    }
  }, [])

  return (
    <>
      <MenuBar />
      {tmpFormData && profile ? (
        <div className="main-container">
          <div className="box-container">
            <div className="box-title">Khai báo phụ huynh và học sinh</div>
            <UserFormComponent
              defaultValues={tmpFormData}
              submitForm={(values) => handleUpdateProfile(values)}
            />
          </div>
        </div>
      ) : ""}
    </>
  )
}