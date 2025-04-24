import { FC } from "react";
import { MenuBar } from "../common/MenuBar/MenuBar";
import { UserFormComponent } from "../modules/Profile/UserForm";

export const ProfilePage:FC = () => {
  return (
    <>
      <MenuBar />
      <div className="main-container">
        <div className="box-container">
          <UserFormComponent />
        </div>
      </div>
    </>
  )
}