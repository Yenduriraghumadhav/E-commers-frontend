import React, { useEffect, useMemo, useState } from "react";
import "./ordersVendorePage.css";
import axios from "axios";

const OrdersVendorePage = () => {
  const vendoreEmails = localStorage.getItem("vendore_email");

  const [ordertrakingdata, setordertrakingdata] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const trakingVenndoreOrderData = async () => {
      try {
        setLoading(true);
        setError("");

        const responseData = await axios.get(
          "http://localhost:8000/vendoreOrdersget",
          {
            params: {
              email: vendoreEmails,
            },
            withCredentials: true,
          }
        );

        setordertrakingdata(responseData.data.ProductsData || []);

        console.log("Vendor product data:", responseData.data.ProductsData);
      } catch (error) {
        console.error("Error fetching vendor orders:", error);
        if (error.response?.status === 401 || error.response?.status === 422) {
          localStorage.removeItem("vendore_email");
          localStorage.removeItem("role");
          sendingto("/vendoreLogin");
          return;
        }
        setError(
          error.response?.data?.detail ||
          "Unable to fetch orders. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (vendoreEmails) {
      trakingVenndoreOrderData();
    } else {
      setError("Vendor email not found. Please log in again.");
      setLoading(false);
    }
  }, [vendoreEmails]);

  // Group multiple products under the same order ID
  const groupedOrders = useMemo(() => {
    const ordersMap = new Map();

    ordertrakingdata.forEach((item) => {
      const orderId = item.orderId;

      if (!ordersMap.has(orderId)) {
        ordersMap.set(orderId, {
          orderId,
          userEmail: item.userEmail,
          products: [],
          totalAmount: 0,
          totalQuantity: 0,
        });
      }

      const order = ordersMap.get(orderId);
      const price = Number(item.productDetails?.product_price) || 0;
      const quantity = Number(item.quality) || 0;

      order.products.push({
        ...item,
        price,
        quantity,
        subtotal: price * quantity,
      });

      order.totalAmount += price * quantity;
      order.totalQuantity += quantity;
    });

    return Array.from(ordersMap.values());
  }, [ordertrakingdata]);

  if (loading) {
    return <div className="orders-message">Loading orders...</div>;
  }

  if (error) {
    return <div className="orders-error">{error}</div>;
  }


  if (groupedOrders.length === 0) {
    return (
      <div className="orders-empty-page">
        <div className="empty-orders-card">
          <div className="empty-orders-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="76"
              height="76"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 7h12l1.5 13h-15L6 7Z" />
              <path d="M9 9V6a3 3 0 0 1 6 0v3" />
              <path d="m9 14 2 2 4-4" />
            </svg>
          </div>

          <span className="empty-orders-badge">
            ORDER DASHBOARD
          </span>

          <h2>No Orders Yet!</h2>

          <p>
            You haven't received any orders yet. Once customers
            purchase your products, their orders will appear here.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="vendor-orders-page">
      <div className="orders-header">
        <div>
          <h1>My Orders</h1>
          <p>View and manage your customer orders.</p>
        </div>

        <div className="orders-count">
          Total Orders: {groupedOrders.length}
        </div>
      </div>

      {groupedOrders.map((order) => (
        <div className="vendor-order-card" key={order.orderId}>
          <div className="vendor-order-header">
            <div>
              <span className="order-label">Order ID</span>
              <h3>{order.orderId}</h3>
            </div>

            <div className="order-status">
              <span className="status-dot"></span>
              Order Received
            </div>
          </div>

          <div className="order-customer">
            <span className="order-label">Customer Email</span>
            <p>{order.userEmail || "Not available"}</p>
          </div>

          <div className="order-products">
            {order.products.map((item, index) => {
              const product = item.productDetails || {};

              return (
                <div
                  className="order-product"
                  key={`${item.productId}-${index}`}
                >
                  <div className="product-information">
                    <h4>{product.product_name || "Product name unavailable"}</h4>

                    <p>
                      <strong>Brand:</strong>{" "}
                      {product.brand_name || "N/A"}
                    </p>

                    <p>
                      <strong>Category:</strong>{" "}
                      {product.category || "N/A"}
                    </p>

                    <p>
                      <strong>Product ID:</strong> {item.productId}
                    </p>

                    {product.description && (
                      <p className="product-description">
                        {product.description}
                      </p>
                    )}

                    {product.bullet_points && (
                      <p className="product-bullets">
                        {product.bullet_points}
                      </p>
                    )}
                  </div>

                  <div className="product-pricing">
                    <p>
                      <span>Unit Price</span>
                      <strong>{item.price.toFixed(2)}</strong>
                    </p>

                    <p>
                      <span>Quantity</span>
                      <strong>{item.quantity}</strong>
                    </p>

                    <p className="product-subtotal">
                      <span>Subtotal</span>
                      <strong>{item.subtotal.toFixed(2)}</strong>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="vendor-order-footer">
            <div>
              <span>Total Products</span>
              <strong>{order.products.length}</strong>
            </div>

            <div>
              <span>Total Quantity</span>
              <strong>{order.totalQuantity}</strong>
            </div>

            <div className="order-total">
              <span>Order Total</span>
              <strong>{order.totalAmount.toFixed(2)}</strong>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersVendorePage;