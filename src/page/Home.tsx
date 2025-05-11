import { FC } from "react";
import { MenuBar } from "../common/MenuBar/MenuBar";

export const HomePage:FC = () => {
  return (
    <>
      <MenuBar />
      <div className="main-container">
        <img className="home-img" src="/btg-home.jpg"/>
      </div>
    </>
  )
}