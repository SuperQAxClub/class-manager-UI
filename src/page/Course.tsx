import { FC } from "react";
import { CourseListComponent } from "../modules/Course/CourseList";
import { MenuBar } from "../common/MenuBar/MenuBar";

export const CoursePage:FC = () => {
  return (
    <>
      <MenuBar />
      <div className="main-container">
        <CourseListComponent />
      </div>
    </>
  )
}