import React, { useEffect, useState } from 'react'
import "./userodersPage.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserodersPage = () => {
  const navigate = useNavigate();
  const Emails = localStorage.getItem("userEmail");
  const [orderlist, setorderlist] = useState([]);
  const [Message, setMessage] = useState("");
  const [ErrorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [trackingData, setTrackingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    orderesData();
  }, [])

  async function orderesData() {
    try {
      const resposnedata = await axios.get("http://localhost:8000/viewOrders",
        {
          params: {
            userEmail: Emails,
          },
          withCredentials: true,
        }
      )

      setorderlist(Array.isArray(resposnedata.data.productDetails) ? resposnedata.data.productDetails : []);
      setMessage(resposnedata.data.message || "");
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 422) {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("role");
        navigate("/UsersLogin");
        return;
      }
      const details = error.response?.data?.detail;
      const validationMessage = Array.isArray(details)
        ? details.map((item) => item.msg || JSON.stringify(item)).join(", ")
        : details || error.response?.data?.message || error.message;
      setErrorMessage(validationMessage);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const getUserTracking = async () => {
      console.log("getusertracking function  started");
      try {
        const email = localStorage.getItem("userEmail");
        const role = localStorage.getItem("role");

        if (!email) {
          setError("User email not found.");
          return;
        }

        if (!role) {
          setError("User role not found.");
          return;
        }

        const response = await axios.get(
          "http://localhost:8000/trakingUserOrder",
          {
            params: {
              email: email,
              role: role
            },
            withCredentials: true
          }
        );
        if (response.data.productDetails) {
          setTrackingData(
            response.data.productDetails
          );
        } else {
          setTrackingData(null);
        }

      } catch (error) {
        setError(
          error.response?.data?.detail ||
          "Failed to get order tracking."
        );
      } finally {
        setLoading(false);
      }
    };

    getUserTracking();

  }, []);

  async function cancallingOrders(orderID, productID) {
    try {
      const delet = await axios.delete(
        "http://localhost:8000/DeletingtrakingOrders",
        {
          params: {
            email: Emails,
          },
          data: {
            orderId: orderID,
            productId: productID,
          },
          withCredentials: true,
        }
      );

      await orderesData();
      await getUserTracking();

      console.log("Delete response:", delet.data);
    } catch (error) {
      console.error(
        "Delete error:",
        error.response?.data || error.message
      );
    }
  }

  if (loading) {
    return (
      <section
        className="orders-tracking"
        aria-label="Order tracking"
      >
        <h2>Order tracking</h2>
        <p>Loading order tracking...</p>
      </section>
    );
  }


  if (error) {
    return (
      <section
        className="orders-tracking"
        aria-label="Order tracking"
      >
        <h2>Order tracking</h2>
        <p>{error}</p>
      </section>
    );
  }

  if (!trackingData) {
    return (
      <section className="orders-tracking" aria-label="Order tracking">

        <div className="orders-empty-card">
          <div className="orders-empty-icon" aria-hidden="true">
            i
          </div>
          <h3 className="orders-empty-title">Order tracking</h3>
          <p className="orders-empty-subtitle">
            Order Some Thing
          </p>
        </div>
      </section>
    );
  }


  if (isLoading || orderlist.length === 0) {
    return (
      <div className="order-empty">
        <div className="orders-empty-panel">
          <span className="orderslist-info-icon" aria-hidden="true">i</span>
          <h2>{isLoading ? "Loading orders" : ErrorMessage ? "Unable to load orders" : "No orders found"}</h2>
          <p>{isLoading ? "Please wait while we retrieve your orders." : ErrorMessage || Message || "Your placed orders will appear here."}</p>
        </div>
      </div>
    );
  }
  return (
    <>
      {orderlist[0] && (
        <section className="orders-delivery-details" aria-label="Delivery details">
          <h2>Delivery details</h2>
          <p><strong>Address :</strong> {orderlist[0].addressLine}</p> <br />
          <p><strong>Phone :</strong> {orderlist[0].phoneNumber}</p> <br />
          <p><strong>Email :</strong> {orderlist[0].userEmail}</p> <br />
          <p><strong>Pincode :</strong> {orderlist[0].Pincode}</p>
        </section>
      )}

      {/* {trackingData.map((trackingData, index) => (
        <section
          key={index}
          className="orders-tracking"
          aria-label="Order tracking"
        >
          <h2>Order tracking</h2>
          <ol className="orders-tracking-steps">
            <li
              className={
                trackingData.ordered
                  ? "orders-tracking-step is-complete"
                  : "orders-tracking-step is-pending"
              }
            >
              <span
                className="orders-tracking-check"
                aria-hidden="true"
              >
                {trackingData.ordered ? "✓" : ""}
              </span>
              <div>
                <strong>Ordered</strong>
                <span className="orders-tracking-date">
                  {trackingData.ordered
                    ? "Order placed"
                    : "Pending"}
                </span>
              </div>
            </li>
            <li
              className={
                trackingData.Shipped
                  ? "orders-tracking-step is-complete"
                  : "orders-tracking-step is-pending"
              }
            >
              <span
                className="orders-tracking-check"
                aria-hidden="true"
              >
                {trackingData.Shipped ? "✓" : ""}
              </span>
              <div>
                <strong>Shipped</strong>
                <span className="orders-tracking-date">
                  {trackingData.Shipped
                    ? "Order shipped"
                    : "Pending"}
                </span>
              </div>
            </li>
            <li
              className={
                trackingData.Outfordelivery
                  ? "orders-tracking-step is-complete"
                  : "orders-tracking-step is-pending"
              }
            >
              <span
                className="orders-tracking-check"
                aria-hidden="true"
              >
                {trackingData.Outfordelivery ? "✓" : ""}
              </span>
              <div>
                <strong>Out for delivery</strong>
                <span className="orders-tracking-date">
                  {trackingData.Outfordelivery
                    ? "Latest update"
                    : "Pending"}
                </span>
              </div>
            </li>
            <li
              className={
                trackingData.Arriving
                  ? "orders-tracking-step is-complete"
                  : "orders-tracking-step is-pending"
              }
            >
              <span
                className="orders-tracking-check"
                aria-hidden="true"
              >
                {trackingData.Arriving ? "✓" : ""}
              </span>
              <div>
                <strong>Arriving</strong>
                <span className="orders-tracking-date">
                  {trackingData.Arriving
                    ? "Order arriving"
                    : "Estimated delivery pending"}
                </span>
              </div>
            </li>
          </ol>
        </section>
      ))} */}

      <div className="Addorderlist-cards">

        {orderlist.map((item, index) => {

          const currentTracking = trackingData.find(
            (tracking) =>
              String(tracking.orderId) === String(item.order_id)
          );

          return (
            <article
              key={`${item.productId ?? item.id ?? "order"}-${index}`}
              className="ordersproducts-card"
            >

              {/* ================= TRACKING - LEFT ================= */}

              <section
                className="orders-tracking"
                aria-label="Order tracking"
              >

                <h2>Order tracking</h2>

                {currentTracking && (
                  <ol className="orders-tracking-steps">

                    {/* ================= ORDERED ================= */}

                    <li
                      className={
                        currentTracking.ordered
                          ? "orders-tracking-step is-complete"
                          : "orders-tracking-step is-pending"
                      }
                    >

                      <span
                        className="orders-tracking-check"
                        aria-hidden="true"
                      >
                        {currentTracking.ordered ? "✓" : ""}
                      </span>

                      <div>
                        <strong>Ordered</strong>

                        <span className="orders-tracking-date">
                          {currentTracking.ordered
                            ? "Order placed"
                            : "Pending"}
                        </span>
                      </div>

                    </li>


                    {/* ================= SHIPPED ================= */}

                    <li
                      className={
                        currentTracking.Shipped
                          ? "orders-tracking-step is-complete"
                          : "orders-tracking-step is-pending"
                      }
                    >

                      <span
                        className="orders-tracking-check"
                        aria-hidden="true"
                      >
                        {currentTracking.Shipped ? "✓" : ""}
                      </span>

                      <div>
                        <strong>Shipped</strong>

                        <span className="orders-tracking-date">
                          {currentTracking.Shipped
                            ? "Order shipped"
                            : "Pending"}
                        </span>
                      </div>

                    </li>


                    {/* ================= OUT FOR DELIVERY ================= */}

                    <li
                      className={
                        currentTracking.Outfordelivery
                          ? "orders-tracking-step is-complete"
                          : "orders-tracking-step is-pending"
                      }
                    >

                      <span
                        className="orders-tracking-check"
                        aria-hidden="true"
                      >
                        {currentTracking.Outfordelivery ? "✓" : ""}
                      </span>

                      <div>
                        <strong>Out for delivery</strong>

                        <span className="orders-tracking-date">
                          {currentTracking.Outfordelivery
                            ? "Latest update"
                            : "Pending"}
                        </span>
                      </div>

                    </li>


                    {/* ================= ARRIVING ================= */}

                    <li
                      className={
                        currentTracking.Arriving
                          ? "orders-tracking-step is-complete"
                          : "orders-tracking-step is-pending"
                      }
                    >

                      <span
                        className="orders-tracking-check"
                        aria-hidden="true"
                      >
                        {currentTracking.Arriving ? "✓" : ""}
                      </span>

                      <div>
                        <strong>Arriving</strong>

                        <span className="orders-tracking-date">
                          {currentTracking.Arriving
                            ? "Order arriving"
                            : "Estimated delivery pending"}
                        </span>
                      </div>

                    </li>

                  </ol>
                )}

                {!currentTracking && (
                  <p>Tracking information is not available.</p>
                )}

              </section>


              {/* ================= PRODUCT DETAILS - RIGHT ================= */}

              <div className="orders-product-content">

                <p className="orders-product-category">
                  {item.category || "Ordered product"}
                </p>

                <h3>
                  {item.product_name ||
                    `Product ${item.productId || "details unavailable"}`}
                </h3>

                {item.brand_name && (
                  <p className="orders-product-brand">
                    {item.brand_name}
                  </p>
                )}

                {/* {item.description && (
                  <p className="orders-product-description">
                    {item.description}
                  </p>
                )} */}

                {item.bullet_points && (
                  <ul className="orders-product-features">
                    {(Array.isArray(item.bullet_points)
                      ? item.bullet_points
                      : item.bullet_points.split("\n")
                    ).map((feature, featureIndex) => (
                      <li
                        key={`${item.productId}-feature-${featureIndex}`}
                      >
                        {String(feature).replace(/^•\s*/, "")}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="orders-product-footer">

                  <span>
                    Qty :{" "}
                    {item.Quality ??
                      item.Quatity ??
                      "Unavailable"}
                  </span>

                </div>

                <div className="orders-product-footer">

                  <span>Cost :</span>
                  {item.productCost == null &&
                    item.product_price == null
                    ? "Price unavailable"
                    : `$${Number(
                      item.productCost ??
                      item.product_price
                    ).toFixed(2)}`}

                </div>

                <button
                  type="submit"
                  style={{ cursor: "pointer" }}
                  className="cancalorders"
                  onClick={() =>
                    cancallingOrders(item.order_id, item.productId)
                  }
                >
                  Cancal Order
                </button>

              </div>

            </article>
          );
        })}

      </div>
    </>
  )
}

export default UserodersPage