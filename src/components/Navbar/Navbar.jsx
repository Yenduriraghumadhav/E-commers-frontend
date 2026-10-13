import React from "react";
import { NavLink } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* ShopZone Logo */}
        <NavLink className="navbar-logo">
          <div className="navbar-logo-icon">S</div>

          <div className="navbar-logo-text">
            <span className="navbar-brand-name">
              Shop<span>Zone</span>
            </span>
            <small>YOUR SHOPPING DESTINATION</small>
          </div>
        </NavLink>

        {/* Customer Navigation Links */}
        <div className="navbar-links">

          <NavLink
            to="/ProductsHomePage"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <span className="nav-icon">⌂</span>
            Products
          </NavLink>

          <NavLink
            to="/wishList"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <span className="nav-icon">♡</span>
            Wishlist
          </NavLink>

          <NavLink
            to="/orders"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <span className="nav-icon">▤</span>
            Orders
          </NavLink>

          <NavLink
            to="/Profile"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <span className="nav-icon">♙</span>
            Profile
          </NavLink>

          <NavLink
            to="/Cart"
            className={({ isActive }) =>
              isActive
                ? "nav-link cart-link active"
                : "nav-link cart-link"
            }
          >
            <span className="nav-icon">🛒</span>
            Cart
          </NavLink>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;