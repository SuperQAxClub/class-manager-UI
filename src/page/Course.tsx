import { FC, useEffect } from "react";
import { CourseListComponent } from "../modules/Course/CourseList";
import { MenuBar } from "../common/MenuBar/MenuBar";
import { useAccountStore } from "../store/accountStore";
import { useLocation } from "wouter";

export const CoursePage:FC = () => {
  const {profile} = useAccountStore();
  const [, navigate] = useLocation();

  useEffect(() => {
    if(!profile) {
      navigate("/login");
    }
  }, [])

  return (
    <>
      <MenuBar />
      <div className="main-container">
        <CourseListComponent />
      </div>
    </>
  )
}