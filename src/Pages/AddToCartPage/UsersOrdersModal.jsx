import React, { useEffect, useState } from "react";
import axios from "axios";
import "./usersOrdersModal.css";
import { useAddToCartAPI } from "../../ApisFiles/AddToCartapi";
import { useNavigate } from "react-router-dom";
import LocationPicker from "./LocationPicker";

const UsersOrdersModal = ({ items, totalPrice, onClose }) => {
  console.log("items products : ", items);
  const { getAddTOCARTList, deleteADDTOCART } = useAddToCartAPI();
  const [formData, setFormData] = useState({
    phoneNumber: "",
    addressLine: "",
    Pincode: "",
    Email: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const navigates = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !loading) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [loading, onClose]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");

    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
      setErrorMessage("User email not found. Please login again.");
      return;
    }

    const products = items.map((item) => ({
      productId: String(item.product_id),
      Quality: String(item.quantity ?? 1),
      productCost: String(item.product_price ?? 0),
    }));

    console.log("Products to order:", products);

    setLoading(true);

    try {
      await axios.post(
        "http://localhost:8000/usersorders",
        {
          userEmail: String(formData.Email),
          phoneNumber: String(formData.phoneNumber),
          addressLine: String(formData.addressLine),
          Pincode: String(formData.Pincode),
          products: products,
        },
        {
          params: {
            userEmail: userEmail,
          },
          withCredentials: true,
        }
      );

      setMessage("Your order has been placed successfully.");

    } catch (error) {

      if (
        error.response?.status === 401 ||
        error.response?.status === 422
      ) {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("role");
        navigates("/UsersLogin");
        return;
      }

      const details = error.response?.data?.detail;

      const validationMessage = Array.isArray(details)
        ? details
          .map((item) => item.msg || JSON.stringify(item))
          .join(", ")
        : details ||
        error.response?.data?.message ||
        "Failed to place the order.";

      setErrorMessage(validationMessage);

    } finally {
      setLoading(false);
    }
  };
  async function deleteProduct(productID) {
    console.log("productID to delete : ", productID);
    try {
      const checkingDeleteData = await deleteADDTOCART(productID);
      navigates("/orders")
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
      className="checkout-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) onClose();
      }}
    >
      <section
        className="checkout-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-modal-title"
      >
        <header className="checkout-modal-header">
          <div>
            <p className="checkout-modal-eyebrow">DELIVERY DETAILS</p>
            <h2 id="checkout-modal-title">Complete your order</h2>
          </div>
          <button
            type="button"
            className="checkout-modal-close"
            aria-label="Close checkout"
            onClick={onClose}
            disabled={loading}
          >
            ×
          </button>
        </header>

        {message ? (
          <div className="checkout-result checkout-result-success" role="status">
            <p>{message}</p>
            <button type="button" className="checkout-submit" onClick={async () => {
              for (const item of items) {
                console.log("items of addtocart : ", item)
                await deleteProduct(item.product_id);
              }
              // window.location.reload()
              onClose();
            }}>
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="checkout-order-summary">
              <div className="checkout-summary-heading">
                <span>Items in your order</span>
                <strong>${totalPrice.toFixed(2)}</strong>
              </div>
              <ul>
                {items.map((item, index) => (
                  <li key={item.product_id ?? index}>
                    <span>{item.product_name || item.title || item.name || "Product"}</span>
                    <span>
                      {Number(item.quantity ?? 1)} × ${Number(item.product_price ?? 0).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {errorMessage && (
              <p className="checkout-result checkout-result-error" role="alert">
                {errorMessage}
              </p>
            )}

            <form className="checkout-form" onSubmit={handleSubmit}>
              <label>
                Email
                <input
                  type="email"
                  name="Email"
                  value={formData.Email}
                  onChange={handleChange}
                  autoComplete="email"
                  placeholder="Enter your email"
                  required
                />
              </label>
              <label>
                Phone number
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  autoComplete="tel"
                  placeholder="Enter your phone number"
                  required
                />
              </label>
              <label>
                Delivery address
                <textarea
                  name="addressLine"
                  value={formData.addressLine}
                  onChange={handleChange}
                  autoComplete="street-address"
                  placeholder="Enter your complete delivery address"
                  rows="3"
                  required
                />
              </label>
              <button
                type="button"
                className="checkout-location-toggle"
                aria-expanded={isLocationPickerOpen}
                onClick={() => setIsLocationPickerOpen((isOpen) => !isOpen)}
              >
                {isLocationPickerOpen ? "Close map" : "Choose address on map"}
              </button>
              {isLocationPickerOpen && (
                <LocationPicker
                  onLocationSelect={({ addressLine, Pincode }) => {
                    setFormData((previous) => ({ ...previous, addressLine, Pincode }));
                    setIsLocationPickerOpen(false);
                  }}
                />
              )}
              <label>
                Pincode
                <input
                  type="text"
                  name="Pincode"
                  value={formData.Pincode}
                  onChange={handleChange}
                  autoComplete="postal-code"
                  inputMode="numeric"
                  maxLength="6"
                  placeholder="6-digit pincode"
                  required
                />
              </label>
              <button type="submit" className="checkout-submit" disabled={loading}>
                {loading ? "Placing order..." : `Place order · $${totalPrice.toFixed(2)}`}
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
};

export default UsersOrdersModal;