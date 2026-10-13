import React, { useState, useEffect } from "react";
import "./vendoreProfilePage.css";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

const VendoreProfilePage = () => {
  const [vendorepersonalData, setvendorepersonalData] = useState({
    vendore_name: "",
    vendore_email: "",
    vendore_mobileNumber: "",
    vendore_country: "",
    vendore_address: "",
    vendore_pincode: "",
    seller_id: "",
  });
  const [vendorData, setVendoreBussinessDetails] = useState({
    Business_Email: "",
    Business_Phone: "",
    Business_Address: "",
    GST_Number: "",
    PAN_Number: "",
    Bank_name: "",
    Bank_ifsc: "",
    Bank_pincode: ""
  });
  const Emails = localStorage.getItem("vendore_email");
  const sendingto = useNavigate();

  useEffect(() => {
    async function totalproducts() {
      const checking = await axios.get(
        "http://localhost:8000/vendorePersonalDetails",
        {
          params: {
            email: Emails,
          },
          withCredentials: true,
        }
      );
      setvendorepersonalData(checking.data.PersonalDetails);
    }

    totalproducts();
  }, [])

  useEffect(() => {
    async function getVendoreData() {
      try {
        const gettingDta = await axios.get("http://localhost:8000/business_details", {
          params: {
            email: Emails
          },
          withCredentials: true,
        });
        setVendoreBussinessDetails(
          gettingDta.data?.BusinessData?.details ?? {}
        );
      } catch (error) {
        console.error("Error fetching vendor business details:", error);
        if (error.response?.status === 401 || error.response?.status === 422) {
          localStorage.removeItem("vendore_email");
          localStorage.removeItem("role");
          sendingto("/vendoreLogin");
          return;
        }
      }
    }

    if (Emails) {
      getVendoreData();
    }
  }, [Emails])

  return (
    <div className="vendor-profile-page">
      <div className="vendor-profile-container">
        <header className="vendor-header">
          <div>
            <span className="page-kicker">VENDOR DASHBOARD</span>
            <h1>Store Profile</h1>
          </div>
        </header>

        <section className="overview-top-card">
          <div className="business-card">
            <div className="avatar-wrap">
              <div className="brand-avatar">SZ</div>
              <div className="status-pill">Active</div>
            </div>

            <div className="business-meta">
              <span className="meta-label">Business profile :</span>
              <h4>{Emails}</h4>
              <p>Owned by : {vendorepersonalData.vendore_name}</p>
              <div className="rating-row">
                <span className="star">★</span>
                <span>4.9/5 customer rating</span>
              </div>
            </div>
          </div>

          <div className="quick-stats">
            <div className="stat-box">
              <span>Total orders</span>
              {/* <strong>{vendorData.totalOrders}</strong> */}
            </div>
            <div className="stat-box">
              <span>Revenue</span>
              {/* <strong>{vendorData.revenue}</strong> */}
            </div>
            <div className="stat-box">
              <span>Products</span>
              {/* <strong>{vendorData.products}</strong> */}
            </div>
            <div className="stat-box">
              <span>Followers</span>
              {/* <strong>{vendorData.followers}</strong> */}
            </div>
          </div>
        </section>


        <div className="vendor-content">
          <main className="vendor-main">
            <section className="panel">
              <div className="panel-header">
                <div>
                  <span className="section-kicker">PERFORMANCE</span>
                  <h3>Sales overview</h3>
                </div>
                <button className="link-btn">This month</button>
              </div>
            </section>

            <section className="panel">
              <div className="panel-header">
                <div>
                  <span className="section-kicker">RECENT</span>
                  <h3>Latest orders</h3>
                </div>
                <button className="link-btn">View all</button>
              </div>
            </section>
          </main>

          <aside className="vendor-sidebar">
            <section className="panel side-panel">
              <div className="panel-header compact">
                <div>
                  <span className="section-kicker">STORE</span>
                  <h3>Business details</h3>
                </div>
              </div>

              <div className="info-list">
                <div className="info-item">
                  <label>Business Email :</label>
                  <p>{vendorData.Business_Email || "Not provided"}</p>
                </div>

                <div className="info-item">
                  <label>Business Phone :</label>
                  <p>{vendorData.Business_Phone || "Not provided"}</p>
                </div>

                <div className="info-item">
                  <label>GST :</label>
                  <p>{vendorData.GST_Number || "Not provided"}</p>
                </div>

                <div className="info-item">
                  <label>Business Address :</label>
                  <p>{vendorData.Business_Address || "Not provided"}</p>
                </div>
              </div>
            </section>

            {/* <section className="panel side-panel">
              <div className="panel-header compact">
                <div>
                  <span className="section-kicker">INSIGHTS</span>
                  <h3>Store health</h3>
                </div>
              </div>

              <div className="health-grid">
                <div className="health-box">
                  <span>Response</span>
                </div>
                <div className="health-box">
                  <span>Delivery</span>
                </div>
                <div className="health-box">
                  <span>Returns</span>
                </div>
                <div className="health-box accent">
                  <span>Growth</span>
                </div>
              </div>
            </section> */}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default VendoreProfilePage;