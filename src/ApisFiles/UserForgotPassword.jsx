import axios from "axios";
import { useNavigate } from "react-router-dom";

export const UserForgotPassword = () => {
    const navigate = useNavigate();

    const userForgotPassword = async (email) => {

        try {
            const response = await axios.post(
                "http://localhost:8000/verifycation", {
                email: email,
            }
            );

            return response.data;

        } catch (error) {

            if (
                error.response?.status === 401 ||
                error.response?.status === 422
            ) {
                localStorage.removeItem("role");
                localStorage.removeItem("vendore_email");
                navigate("/VendoreLogin");
                return null;
            }

            console.error(
                "Error:",
                error.response?.data || error.message
            );

            throw error;
        }
    };

    const userVerifyOtp = async (email, otp) => {

        try {
            const response = await axios.post(
                "http://localhost:8000/usersForgotPassword",
                {
                    email: email,
                    otp: otp
                }, {
                withCredentials: true
            }
            );

            return response.data;

        } catch (error) {

            if (
                error.response?.status === 401 ||
                error.response?.status === 422
            ) {
                localStorage.removeItem("role");
                localStorage.removeItem("vendore_email");
                navigate("/VendoreLogin");
                return null;
            }

            console.error(
                "Error:",
                error.response?.data || error.message
            );

            throw error;
        }
    };


    const userResetPassword = async (newPassword, email) => {

        try {
            const response = await axios.post(
                "http://localhost:8000/resetPassword",
                {
                    email: email,
                    new_password: newPassword
                }, {
                withCredentials: true,
            }
            );

            return response.data;

        } catch (error) {

            if (
                error.response?.status === 401 ||
                error.response?.status === 422
            ) {
                localStorage.removeItem("role");
                localStorage.removeItem("vendore_email");
                navigate("/VendoreLogin");
                return null;
            }

            console.error(
                "Error:",
                error.response?.data || error.message
            );

            throw error;
        }
    };

    return {
        userForgotPassword,
        userVerifyOtp,
        userResetPassword
    }

};