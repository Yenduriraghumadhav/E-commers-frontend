import axios from "axios";
import { useNavigate } from "react-router-dom";

export const ForgotpasswordsVendore = () => {
    const navigate = useNavigate();

    const vendorForgotPassword = async (email) => {

        try {
            const response = await axios.post(
                "http://localhost:8000/vendoreForgotPassword", {
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

    const vendorVerifyOtp = async (email, otp) => {

        try {
            const response = await axios.post(
                "http://localhost:8000/vendorOtp",
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


    const vendorResetPassword = async (newPassword, email) => {

        try {
            const response = await axios.post(
                "http://localhost:8000/vendorResetPassword",
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
        vendorForgotPassword,
        vendorVerifyOtp,
        vendorResetPassword
    }

};