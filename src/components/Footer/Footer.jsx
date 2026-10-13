import React from "react";
import { Link } from "react-router-dom";
import "./footer.css";

const Footer = () => {
    return (
        <footer className="user-footer">
            <div className="user-footer-container">
                <div className="user-footer-section user-footer-brand">
                    <h2>YourStore</h2>

                    <p>
                        Shop quality products at the best prices.
                        Easy ordering, secure payments and reliable
                        delivery at your doorstep.
                    </p>
                </div>


                <div className="user-footer-section">
                    <h3>Shop</h3>
                    <ul>
                        <li>
                            <Link to="/ProductsHomePage">All Products</Link>
                        </li>

                        <li>
                            <Link to="/ProductsHomePage">Categories</Link>
                        </li>

                        <li>
                            <Link to="/orders">My Orders</Link>
                        </li>

                        <li>
                            <Link to="/Cart">Cart</Link>
                        </li>
                    </ul>
                </div>

                <div className="user-footer-section">
                    <h3>My Account</h3>

                    <ul>
                        <li>
                            <Link to="/Profile">My Profile</Link>
                        </li>

                        <li>
                            <Link to="/orders">Order History</Link>
                        </li>

                        <li>
                            <Link to="/wishlist">wishList</Link>
                        </li>
                    </ul>
                </div>

                <div className="user-footer-section">
                    <h3>Customer Support</h3>

                    <ul>
                        <li>
                            <Link to="/contact">Contact Us</Link>
                        </li>

                        <li>
                            <Link to="/help">Help Center</Link>
                        </li>

                        <li>
                            <Link to="/shipping">Shipping Information</Link>
                        </li>

                        <li>
                            <Link to="/returns">Returns & Refunds</Link>
                        </li>
                    </ul>
                </div>

            </div>


            <div className="user-footer-policy">

                <Link to="/privacy">
                    Privacy Policy
                </Link>

                <Link to="/terms">
                    Terms & Conditions
                </Link>

                <Link to="/refund-policy">
                    Refund Policy
                </Link>

                <Link to="/shipping-policy">
                    Shipping Policy
                </Link>

            </div>

            <div className="user-footer-bottom">

                <p>
                    © {new Date().getFullYear()} YourStore. All rights reserved.
                </p>

                <p>
                    Made with ❤️ for our customers
                </p>

            </div>

        </footer>
    );
};

export default Footer;