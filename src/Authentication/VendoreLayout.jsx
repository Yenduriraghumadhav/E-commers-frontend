import React from "react";
import { Outlet } from "react-router-dom";
import "./VendoreLayout.css";
import VendoreNavbar from "../components/VendoreNavbar/VendoreNavbar"


const VendoreLayout = () => {
  return (
    <>
      <VendoreNavbar />

      <main className="vendor-page-content">
        <Outlet />
      </main>
    </>
  );
};

export default VendoreLayout;