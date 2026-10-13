import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ForgotpasswordsVendore } from "../../../ApisFiles/VendorForgotPasswordAPI";
import "./forgotpasswordsVendore.css";

const VendorForgotPassword = () => {
    const navigate = useNavigate();
    const {
        vendorForgotPassword,
        vendorVerifyOtp,
        vendorResetPassword
    } = ForgotpasswordsVendore();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setMessage("");
        setErrorMessage("");
        if (!email.trim()) {
            setErrorMessage("Please enter your email");
            return;
        }

        try {

            setLoading(true);

            const response = await vendorForgotPassword(email);

            console.log(
                "Forgot password response:",
                response
            );

            setMessage(
                response?.message ||
                "OTP sent to your email"
            );

            setStep(2);

        } catch (error) {

            console.error(
                "Forgot password error:",
                error
            );

            setErrorMessage(
                error.response?.data?.detail ||
                error.response?.data?.message ||
                "Unable to send OTP"
            );

        } finally {

            setLoading(false);

        }
    };

    const handleVerifyOtp = async (e) => {

        e.preventDefault();

        setMessage("");
        setErrorMessage("");

        if (!otp.trim()) {
            setErrorMessage("Please enter the OTP");
            return;
        }

        try {

            setLoading(true);

            const response = await vendorVerifyOtp(
                email,
                otp
            );

            console.log(
                "OTP response:",
                response
            );

            setMessage(
                response?.message ||
                "OTP verified successfully"
            );

            setStep(3);

        } catch (error) {

            console.error(
                "OTP verification error:",
                error
            );

            setErrorMessage(
                error.response?.data?.detail ||
                error.response?.data?.message ||
                "Invalid OTP"
            );

        } finally {

            setLoading(false);

        }
    };


    const handleResetPassword = async (e) => {

        e.preventDefault();

        setMessage("");
        setErrorMessage("");

        if (!newPassword.trim()) {
            setErrorMessage("Please enter a new password");
            return;
        }

        try {

            setLoading(true);

            const response = await vendorResetPassword(
                newPassword,
                email
            );

            console.log(
                "Reset password response:",
                response
            );

            setMessage(
                response?.message ||
                "Password reset successfully"
            );

            setNewPassword("");
            navigate("/VendoreLogin");

        } catch (error) {

            console.error(
                "Reset password error:",
                error
            );

            setErrorMessage(
                error.response?.data?.detail ||
                error.response?.data?.message ||
                "Unable to reset password"
            );

        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="vendor-forgot-password-page">

            <div className="vendor-forgot-password">

                {/* SUCCESS MESSAGE */}

                {message && (
                    <div className="success-message">
                        {message}
                    </div>
                )}


                {/* ERROR MESSAGE */}

                {errorMessage && (
                    <div className="error-message">
                        {errorMessage}
                    </div>
                )}


                {/* =================================
                    STEP 1
                ================================= */}

                {step === 1 && (

                    <form onSubmit={handleSendOtp}>

                        <h3>Enter your email</h3>

                        <input
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                        />

                        <button
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Sending..."
                                : "Send OTP"
                            }
                        </button>

                    </form>
                )}


                {/* =================================
                    STEP 2
                ================================= */}

                {step === 2 && (

                    <form onSubmit={handleVerifyOtp}>

                        <h3>Verify OTP</h3>

                        <p>
                            OTP has been sent to:
                        </p>

                        <strong>
                            {email}
                        </strong>

                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) =>
                                setOtp(e.target.value)
                            }
                        />

                        <button
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Verifying..."
                                : "Verify OTP"
                            }
                        </button>


                        <button
                            type="button"
                            onClick={() => {
                                setStep(1);
                                setOtp("");
                                setMessage("");
                                setErrorMessage("");
                            }}
                        >
                            Change Email
                        </button>

                    </form>
                )}


                {/* =================================
                    STEP 3
                ================================= */}

                {step === 3 && (

                    <form onSubmit={handleResetPassword}>

                        <h3>
                            Create New Password
                        </h3>

                        <p>
                            Create a new password for your
                            vendor account.
                        </p>

                        <input
                            type="password"
                            placeholder="New password"
                            value={newPassword}
                            onChange={(e) =>
                                setNewPassword(e.target.value)
                            }
                        />

                        <button
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Resetting..."
                                : "Reset Password"
                            }
                        </button>

                    </form>
                )}

            </div>

        </div>
    );
};

export default VendorForgotPassword;