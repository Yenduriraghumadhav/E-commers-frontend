import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {

    const auth = useAuth();

    const storedRole = localStorage.getItem("role");

    const storedEmail =
        localStorage.getItem("userEmail") ||
        localStorage.getItem("vendore_email") ||
        localStorage.getItem("email");

    const isAuthenticated =
        auth?.user?.isAuthenticated || Boolean(storedEmail);

    const role = storedRole || auth?.user?.role;

    if (!isAuthenticated) {
        return <Navigate to="/UsersLogin" replace />;
    }

    if (
        allowedRoles &&
        !allowedRoles.includes(role)
    ) {

        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;