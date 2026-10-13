import React from 'react'
import "./vendoreLogin.css"
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VendoreLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/vendore_login", { email: email.trim(), password: password },
        { withCredentials: true, headers: { "Content-Type": "application/json" }, });
        const vendorEmail = response.data?.vendore_email || response.data?.email || email.trim();
        localStorage.setItem("vendore_email", vendorEmail);
        localStorage.setItem("role" ,response.data.role)
      alert(response.data?.message || "Login successful");

      navigate("/vendoresHomePage");
    } catch (error) {
      
      if (error.response) {
        const data = error.response.data;
        let message = "Login failed";
        if (typeof data === "string") {
          message = data;
        } else if (data?.detail) {
          if (Array.isArray(data.detail)) {
            message = data.detail
              .map((item) => item.msg || JSON.stringify(item))
              .join("\n");
          } else {
            message = String(data.detail);
          }
        } else if (data?.message) {
          message = String(data.message);
        }

        alert(message);
      } else if (error.request) {
        alert("Cannot connect to the backend server.");
      } else {
        alert(error.message || "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  async function navigatingtoforgotPassword() {
    navigate("/forgotpassword");
  }


  return (
    <>
      <div className="login-page">
        <div className="login-card">

          <div className="brand">
            <div className="brand-icon">V</div>

            <div>
              <h2>VENDORE</h2>
              <span>Vendor Portal</span>
            </div>
          </div>

          <div className="login-heading">
            <h1>Welcome back 👋</h1>
            <p>Sign in to manage your store</p>
          </div>
          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Business Email</label>

              <div className="input-box">
                <span className="input-icon">✉</span>

                <input
                  type="email"
                  placeholder="Enter your business email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <div className="password-header">
                <label>Password</label>

                <button type="button" onClick={navigatingtoforgotPassword}>
                  Forgot password?
                </button>
              </div>

              <div className="input-box">
                <span className="input-icon">🔒</span>

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  className="show-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button className="login-button" type="submit">
              Sign In
              <span>→</span>
            </button>

          </form>

          <div className="register">
            <span>Don't have a vendor account?</span>

            <button type="button">
              Create Account
            </button>
          </div>

          <div className="secure">
            <span>🛡</span>
            Secure vendor login
          </div>

        </div>
      </div>
    </>
  )
}

export default VendoreLogin