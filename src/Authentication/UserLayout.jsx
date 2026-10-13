import React from "react";
import { Outlet } from "react-router-dom";
import "./UserLayout.css";
import Navbar from "../components/Navbar/Navbar";


const UserLayout = () => {
  return (
    <>
      <Navbar />

      <main className="users-page-content">
        <Outlet />
      </main>
    </>
  );
};

export default UserLayout;