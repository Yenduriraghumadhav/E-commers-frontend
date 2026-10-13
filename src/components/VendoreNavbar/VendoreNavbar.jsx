import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./vendoreNavbar.css";

const VendoreNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const Emials = localStorage.getItem("vendore_email");
  const roless = localStorage.getItem("role");

  return (
    <header className="vendor-navbar">
      <div className="vendor-navbar-container">
        {/* Logo */}
        <a href="/vendor/dashboard" className="vendor-brand">
          <div className="vendor-brand-icon">V</div>
          <div className="vendor-brand-text">
            <h2>Vendora</h2>
            <span>Vendor Portal</span>
          </div>
        </a>

        {/* Search */}
        {/* <div className="vendor-search">
          <span className="search-icon">⌕</span>
          <input
            type="text"
            placeholder="Search products, orders..."
            aria-label="Search products and orders"
          />
          <span className="search-shortcut">⌘ K</span>
        </div> */}

        {/* Right Actions */}
        <div className="vendor-navbar-actions">
          <button
            className="vendor-icon-button"
            aria-label="Notifications"
            title="Notifications"
          >
            <svg
              viewBox="0 0 24 24"
              width="21"
              height="21"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
              <path d="M10 21h4" />
            </svg>
            <span className="notification-dot"></span>
          </button>

          <div className="vendor-profile-wrapper">
            <button
              className="vendor-profile"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
            >
              <div className="vendor-profile-info">
                <strong>{Emials}</strong>
                <span>{roless}</span>
              </div>
              <span className="profile-chevron">
                {menuOpen ? "➖" : "➕"}
              </span>
            </button>

            {menuOpen && (
              <div className="vendor-profile-menu">
                <a href="/vendor/profile">My Profile</a>
                <a href="/vendor/settings">Account Settings</a>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    // Add your logout function here.
                  }}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <button
            className="vendor-mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle vendor menu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="vendor-nav-links">
        <NavLink
          to="/vendoresHomePage"
          end
          className={({ isActive }) =>
            `vendor-nav-link${isActive ? " active" : ""}`
          }
        >
          <span>▦</span> Dashboard
        </NavLink>

        <NavLink
          to="/VendoreSingleProductAdding"
          end
          className={({ isActive }) =>
            `vendor-nav-link${isActive ? " active" : ""}`
          }
        >
          <span>◇</span> Add Products
        </NavLink>

        <NavLink
          to="/ordersTraking"
          end
          className={({ isActive }) =>
            `vendor-nav-link${isActive ? " active" : ""}`
          }
        >
          <span>▤</span> Orders
        </NavLink>

        <NavLink
          to="/multiProdctAdding"
          end
          className={({ isActive }) =>
            `vendor-nav-link${isActive ? " active" : ""}`
          }
        >
          <span>▤</span> Bulk Upload
        </NavLink>

        <NavLink
          to="/VendoreProfile"
          end
          className={({ isActive }) =>
            `vendor-nav-link${isActive ? " active" : ""}`
          }
        >
          <span>♙</span> Profile
        </NavLink>
      </nav>
    </header>
  );
};

export default VendoreNavbar;