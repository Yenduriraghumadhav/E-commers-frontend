import React, { useEffect, useState } from "react";
import "./profilePage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const useremails = localStorage.getItem("userEmail");
  const [userDetails, setUserDetails] = useState(null);
  const [wishlists, setwishlist] = useState([]);
  const [OrderList, setOrderList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    profileData();
    wishListData();
    OrderGetting();
  }, []);

  async function profileData() {
    try {
      const response = await axios.get(
        "http://localhost:8000/usersDetails",
        {
          params: {
            userEmail: useremails,
          },
          withCredentials: true,
        }
      );

      setUserDetails(response.data.details);

    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 422) {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("role");
        navigate("/UsersLogin");
        return;
      }
      console.error(
        "Error:",
        error.response?.data || error.message
      );
    }
  }

  async function wishListData() {
    try {
      const resposnedata = axios.get("http://localhost:8000/viewWishList",
        {
          params: {
            userEmail: useremails,
          },
          withCredentials: true,
        }
      )

      setwishlist((await resposnedata).data.wishList)
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 422) {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("role");
        navigate("/UsersLogin");
        return;
      }
      console.error(
        "Error :",
        error.response?.data || error.message
      )
    }
  }

  async function logOut() {
    try {
      const loging = await axios.post("http://localhost:8000/Userlogout", {}, { withCredentials: true });
      if (loging.status == 200) {
        localStorage.removeItem("userEmail")
        navigate("/UsersLogin")
      }
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 422) {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("role");
        navigate("/UsersLogin");
        return;
      }
      console.error(
        "Error :",
        error.response?.data || error.message
      )
    }
  }

  async function OrderGetting() {
    try {
      const flteringData = await axios.get("http://localhost:8000/viewOrders", {
        params: {
          userEmail: useremails
        },
        withCredentials: true
      })

      setOrderList(flteringData.data.productDetails)
      console.log("order Data : ", OrderList)
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 422) {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("role");
        navigate("/UsersLogin");
        return;
      }
      console.error(
        "Error :",
        error.response?.data || error.message
      )
    }
  }

  function handleOrders() {
    navigate("/orders");
  }

  function handleWhishlist() {
    navigate("/wishList");
  }

  function handleAddtoCart() {
    navigate("/Cart");
  }

  async function deleteAccount() {
    try {
      const deleing = await axios.delete("http://localhost:8000/usersDetails", {
        params: {
          userEmail: useremails
        },
        withCredentials: true
      })
      navigate("/UsersLogin")
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 422) {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("role");
        navigate("/UsersLogin");
        return;
      }
      console.error(
        "Error :",
        error.response?.data || error.message
      )
    }

  }

  if (!userDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">

        <div className="page-header">
          <div>
            <span className="page-label">MY ACCOUNT</span>
            <h1>My Profile</h1>
            <p>Manage your account, orders and preferences.</p>
          </div>

          <button className="logout-btn" onClick={logOut}>
            ↪ &nbsp; Sign Out
          </button>
        </div>

        <section className="profile-overview">

          <div className="user-section">

            <div className="user-avatar">
              {userDetails.first_name?.charAt(0).toUpperCase()}
              {userDetails.last_name?.charAt(0).toUpperCase()}
            </div>

            <div className="user-info">

              <div className="name-row">
                <h2>
                  {userDetails.first_name} {userDetails.last_name}
                </h2>

                <span className="verified-badge">
                  ✓
                </span>
              </div>

              <p>{userDetails.userEmail}</p>

              <span className="member-since">
                ✦ Member
              </span>

            </div>
          </div>

          <div className="account-stats">

            <div className="account-stat">
              <strong>{OrderList.length}</strong>
              <span>Orders</span>
            </div>

            <div className="account-stat">
              <strong>{wishlists.length}</strong>
              <span>Wishlist</span>
            </div>

            {/* <div className="account-stat">
              <strong>4.9</strong>
              <span>Rating</span>
            </div> */}

          </div>

        </section>

        <div className="profile-grid">

          <div className="profile-main">

            <section className="profile-card">

              <div className="card-title">
                <div>
                  <span>ACCOUNT</span>
                  <h3>Personal Information</h3>
                </div>

                <button className="card-edit">
                  Edit
                </button>
              </div>

              <div className="details-grid">

                <div className="detail">
                  <label>First Name</label>
                  <p>{userDetails.first_name}</p>
                </div>

                <div className="detail">
                  <label>Last Name</label>
                  <p>{userDetails.last_name}</p>
                </div>

                <div className="detail">
                  <label>Email Address</label>
                  <p>{userDetails.userEmail}</p>
                </div>

                <div className="detail">
                  <label>Phone Number</label>
                  <p>{userDetails.phone_number}</p>
                </div>

                <div className="detail">
                  <label>Pin Code</label>
                  <p>{userDetails.pincode}</p>
                </div>

                <div className="detail">
                  <label>Address</label>
                  <p>{userDetails.address}</p>
                </div>

              </div>

            </section>

          </div>

          <aside className="profile-sidebar">

            <section className="sidebar-card">

              <span className="sidebar-label">
                ACCOUNT SETTINGS
              </span>

              <div className="account-menu">

                <button className="menu-item">
                  <span className="menu-icon">▣</span>
                  <span onClick={handleOrders}>My Orders</span>
                  <b>›</b>
                </button>

                <button className="menu-item">
                  <span className="menu-icon">♡</span>
                  <span onClick={handleWhishlist}>Wishlist</span>
                  <b>›</b>
                </button>

                <button className="menu-item">
                  <span className="menu-icon">⌂</span>
                  <span onClick={handleAddtoCart}>Add-To-Cart</span>
                  <b>›</b>
                </button>

                <button className="menu-item" onClick={deleteAccount}>
                  <span className="menu-icon">⚙</span>
                  <span>Delete Account</span>
                  <b>›</b>
                </button>

              </div>

            </section>

          </aside>

        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
