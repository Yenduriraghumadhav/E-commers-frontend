import React, { useState } from "react";
import axios from "axios";
import "./vendoreBusinessFeilds.css";

const initialForm = {
    Business_Email: "",
    Business_Phone: "",
    Business_Address: "",
    GST_Number: "",
    PAN_Number: "",
    Bank_name: "",
    Bank_ifsc: "",
    Bank_pincode: "",
};

const VendoreBusinessFeilds = () => {
    const [formData, setFormData] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const vendoreEmail = localStorage.getItem("vendore_email");


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                vendore_email: vendoreEmail,
                details: formData
            };
            const response = await axios.post(
                "http://localhost:8000/bussines_details",
                payload,
                {
                    withCredentials: true
                }
            );

            alert(
                response.data?.message ||
                "Business details saved successfully."
            );

            setFormData(initialForm);

        } catch (error) {
            console.error(
                "Business details error:",
                error.response?.data || error.message
            );
            if (
                error.response?.status === 401 ||
                error.response?.status === 422
            ) {
                localStorage.removeItem("role");
                localStorage.removeItem("vendore_email");
                navigate("/UsersLogin");

                return;
            }
            alert(
                error.response?.data?.detail ||
                error.response?.data?.message ||
                "Something went wrong. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="vendor-business-page">
            <div className="vendor-business-card">
                <div className="form-header">
                    <div>
                        <span className="eyebrow">BUSINESS PROFILE</span>
                        <h2>Vendor Business Details</h2>
                    </div>
                    <button type="button" className="secondary-btn">
                        Preview
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="business-form">
                    <div className="form-grid">
                        <div className="input-group full-width">
                            <label htmlFor="Business_Email">Business Email</label>
                            <input
                                id="Business_Email"
                                name="Business_Email"
                                type="email"
                                value={formData.Business_Email}
                                onChange={handleChange}
                                placeholder="business@example.com"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="Business_Phone">Business Phone</label>
                            <input
                                id="Business_Phone"
                                name="Business_Phone"
                                type="tel"
                                value={formData.Business_Phone}
                                onChange={handleChange}
                                placeholder="+91 98765 43210"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="GST_Number">GST Number</label>
                            <input
                                id="GST_Number"
                                name="GST_Number"
                                value={formData.GST_Number}
                                onChange={handleChange}
                                placeholder="27ABCDE1234F1Z5"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="PAN_Number">PAN Number</label>
                            <input
                                id="PAN_Number"
                                name="PAN_Number"
                                value={formData.PAN_Number}
                                onChange={handleChange}
                                placeholder="ABCDE1234F"
                                required
                            />
                        </div>

                        <div className="input-group full-width">
                            <label htmlFor="Business_Address">Business Address</label>
                            <textarea
                                id="Business_Address"
                                name="Business_Address"
                                rows="4"
                                value={formData.Business_Address}
                                onChange={handleChange}
                                placeholder="Enter your business address"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="Bank_name">Bank Name</label>
                            <input
                                id="Bank_name"
                                name="Bank_name"
                                value={formData.Bank_name}
                                onChange={handleChange}
                                placeholder="HDFC Bank"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="Bank_ifsc">Bank IFSC</label>
                            <input
                                id="Bank_ifsc"
                                name="Bank_ifsc"
                                value={formData.Bank_ifsc}
                                onChange={handleChange}
                                placeholder="HDFC0001234"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="Bank_pincode">Bank Pincode</label>
                            <input
                                id="Bank_pincode"
                                name="Bank_pincode"
                                value={formData.Bank_pincode}
                                onChange={handleChange}
                                placeholder="560001"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-btn">
                            Cancel
                        </button>
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? "Saving..." : "Save Details"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VendoreBusinessFeilds;