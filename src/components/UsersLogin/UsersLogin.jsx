import React, { useState } from "react";
import "./usersLogin.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UsersLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
        "http://localhost:8000/usersLogin",
        {
          email: email.trim(),
          password: password
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      localStorage.setItem("userEmail", response.data.userEmail)
      localStorage.setItem("role" , response.data.role)
      // alert(response.data?.message || "Login successful");
      navigate("/ProductsHomePage");
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

  function createAccount() {
    navigate("/signup");
  }

  return (
    <div className="login-page">

      <div className="bg-shape bg-shape-one"></div>
      <div className="bg-shape bg-shape-two"></div>

      <div className="login-container">

        <div className="login-brand">

          <div className="brand-icon">
            U
          </div>

          <div className="brand-info">
            <h2>USERS</h2>
            <span>Users Portal</span>
          </div>

        </div>

        <div className="login-heading">

          <h1>
            Welcome back 👋
          </h1>

          <p>
            Sign in to Buy What U Want
          </p>

        </div>

        <form onSubmit={handleSubmit}>

          {/* EMAIL */}

          <div className="input-group">

            <label htmlFor="email">
              Email
            </label>

            <div className="input-wrapper">

              <span className="input-icon">

                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="2"
                  />

                  <path d="m3 7 9 6 9-6" />
                </svg>

              </span>

              <input
                type="email"
                id="email"
                placeholder="user@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />

            </div>

          </div>

          {/* PASSWORD */}

          <div className="input-group">

            <div className="password-label">

              <label htmlFor="password">
                Password
              </label>

              <button
                type="button"
                className="forgot-button"
                onClick={() => {
                  console.log("Forgot password");
                }}
              >
                Forgot password?
              </button>

            </div>

            <div className="input-wrapper">

              <span className="input-icon">

                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect
                    x="4"
                    y="10"
                    width="16"
                    height="11"
                    rx="2"
                  />

                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>

              </span>

              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="show-password"
                onClick={() => {
                  setShowPassword((prev) => !prev);
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>

          </div>

          {/* REMEMBER ME */}

          <div className="login-options">

            <span className="secure-text">
              🔒 Secure login
            </span>

          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >

            <span>
              {loading ? "Signing in..." : "Sign In"}
            </span>

            {!loading && (
              <span className="arrow">
                →
              </span>
            )}

          </button>

        </form>

        <div className="login-register">

          <span>
            Don't have a user account?
          </span>

          <button
            type="button"
            className="register-button"
            onClick={createAccount}
          >
            Create Account
          </button>

        </div>

        <div className="security-note">

          <span className="security-icon">
            ✓
          </span>

          <span>
            Your information is securely protected.
          </span>

        </div>

      </div>

    </div>
  );
};

export default UsersLogin;