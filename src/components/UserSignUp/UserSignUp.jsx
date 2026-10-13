import React, { useState } from "react";
import axios from "axios";
import "./userSignUp.css";
import { useNavigate } from "react-router-dom";

const UserSignUp = () => {

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        address: "",
        phone_number: "",
        pincode: "",
        password: "",
        Renter_Password: "",
        userEmail: "",
        Gender: "",
        country: "IN"
    });
    const [otp, setOtp] = useState("");
    const [showOtpPopup, setShowOtpPopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const navigatesss = useNavigate();


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));
        setError("");
        setMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);
        try {
            const response = await axios.post(
                "http://localhost:8000/usersDetails",
                {
                    ...formData,
                    step: "send_otp",
                    otp: null
                },
                {
                    withCredentials: true
                }
            );
            setMessage(
                "OTP sent successfully to your email."
            );
            setShowOtpPopup(true);
        } catch (error) {
            setError(
                error.response?.data?.detail ||
                "Failed to send OTP."
            );

        } finally {
            setLoading(false);
        }
    };


    const handleVerifyOtp = async () => {
        if (!otp) {
            setError(
                "Please enter the OTP."
            );
            return;
        }

        if (otp.length !== 6) {
            setError(
                "OTP must contain 6 digits."
            );
            return;
        }

        setError("");
        setMessage("");
        setLoading(true);
        try {
            const response = await axios.post(
                "http://localhost:8000/usersDetails",
                {
                    ...formData,
                    step: "verify_otp",
                    otp: otp
                },
                {
                    withCredentials: true
                }
            );
            setMessage(
                "Registration successful!"
            );
            setShowOtpPopup(false);
            setOtp("");
            setFormData({
                first_name: "",
                last_name: "",
                address: "",
                phone_number: "",
                pincode: "",
                password: "",
                Renter_Password: "",
                userEmail: "",
                Gender: "",
                country: "IN"
            });
            localStorage.setItem("userEmail", response.data.userEmail)
            localStorage.setItem("role", response.data.role)
            navigatesss("/ProductsHomePage")

        } catch (error) {
            setError(
                error.response?.data?.detail ||
                "OTP verification failed."
            );
        } finally {
            setLoading(false);
        }
    };


    const handleOtpChange = (e) => {
        const value = e.target.value
            .replace(/\D/g, "")
            .slice(0, 6);
        setOtp(value);
        setError("");
    };


    const closeOtpPopup = () => {
        setShowOtpPopup(false)
        setOtp("");
        setError("");
    };


    return (
        <div className="registration-container">
            <div className="registration-card">
                <h2>
                    Create Account
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <input
                            type="text"
                            name="first_name"
                            placeholder="First Name"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="last_name"
                            placeholder="Last Name"
                            value={formData.last_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <input
                        type="email"
                        name="userEmail"
                        placeholder="Email"
                        value={formData.userEmail}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="phone_number"
                        placeholder="Phone Number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="pincode"
                        placeholder="Pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        required
                    />

                    <select
                        name="Gender"
                        value={formData.Gender}
                        onChange={handleChange}
                        required
                    >
                        <option value="">
                            Select Gender
                        </option>
                        <option value="Male">
                            Male
                        </option>
                        <option value="Female">
                            Female
                        </option>
                        <option value="Other">
                            Other
                        </option>
                    </select>

                    <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                    >
                        <option value="IN">
                            India
                        </option>
                        <option value="US">
                            United States
                        </option>
                        <option value="UK">
                            United Kingdom
                        </option>
                    </select>


                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="Renter_Password"
                        placeholder="Re-enter Password"
                        value={formData.Renter_Password}
                        onChange={handleChange}
                        required
                    />
                    {error && !showOtpPopup && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {message && !showOtpPopup && (
                        <div className="success-message">
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Sending OTP..."
                            : "Submit"
                        }

                    </button>
                </form>
            </div>

            {showOtpPopup && (
                <div className="otp-overlay">
                    <div className="otp-popup">
                        <button
                            type="button"
                            className="otp-close"
                            onClick={closeOtpPopup}
                        >
                            ×
                        </button>

                        <h2>
                            Verify Your Email
                        </h2>

                        <p className="otp-description">
                            We have sent a 6-digit OTP to
                        </p>

                        <p className="otp-email">
                            {formData.userEmail}
                        </p>

                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength="6"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={handleOtpChange}
                            className="otp-input"
                            autoFocus
                        />

                        {error && (

                            <div className="otp-error">
                                {error}
                            </div>

                        )}

                        {message && (

                            <div className="otp-success">
                                {message}
                            </div>

                        )}

                        <button
                            type="button"
                            className="verify-button"
                            onClick={handleVerifyOtp}
                            disabled={
                                loading ||
                                otp.length !== 6
                            }
                        >

                            {loading
                                ? "Verifying..."
                                : "Verify OTP"
                            }

                        </button>

                        <p className="otp-footer">
                            OTP is valid for 5 minutes.
                        </p>
                        
                    </div>

                </div>

            )}

        </div>
    );
};

export default UserSignUp;