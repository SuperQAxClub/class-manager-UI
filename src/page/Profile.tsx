import { FC } from "react";
import { MenuBar } from "../common/MenuBar/MenuBar";
import { UserFormComponent } from "../modules/Profile/UserForm";

export const ProfilePage:FC = () => {
  return (
    <>
      <MenuBar />
      <div className="main-container">
        <div className="box-container">
          <div className="box-title">Khai báo phụ huynh và học sinh</div>
          <UserFormComponent />
        </div>
      </div>
    </>
  )
}