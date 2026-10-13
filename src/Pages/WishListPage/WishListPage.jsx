import React, { useEffect, useState } from "react";
import "./wishListPage.css";
import { useWishlistAPI } from "../../ApisFiles/Wishlistapi";

const WishListPage = () => {
  const { getWishList, deleteWishList } = useWishlistAPI();
  const [wishlist, setwishlist] = useState([]);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const responseData = await getWishList();
      if (!responseData) {
        return;
      }
      setwishlist(
        responseData.wishList ||
        responseData.productDetails ||
        []
      );
      setMessage(responseData.message || "");
    } catch (error) {
      const details = error.response?.data?.detail;
      const validationMessage = Array.isArray(details)
        ? details
          .map((item) => item.msg || JSON.stringify(item))
          .join(", ")
        : details ||
        error.response?.data?.message ||
        error.message;

      setErrorMessage(validationMessage);
      console.error(
        "Wishlist Error:",
        error.response?.data || error.message
      );
    }
  };

  const deletetingData = async (productID) => {
    try {
      const checkingDeleteData = await deleteWishList(productID);
      await loadWishlist();
    } catch (error) {
      console.log(error);
    }
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="wishlist-empty">
        <div className="wishlist-empty-panel">
          <span className="wishlist-info-icon" aria-hidden="true">i</span>
          <h2>Your wishlist is empty</h2>
          <p>
            {errorMessage || message || "Save products you like to see them here."}
          </p>
        </div>
      </div>
    );
  }

  return (

    <div className="wishlist-cards">
      {wishlist.map((item, index) => (
        <div
          key={item.product_id || item.id || index} className="product-card">

          {/* <div className="product-card-image-wrap">
            <img
              src={
                item.image ||
                item.product_image ||
                "https://via.placeholder.com/300x220?text=Product"
              }
              alt={
                item.product_name ||
                item.title ||
                item.name ||
                "Product"
              } />
          </div> */}

          <div className="product-card-body">
            <span className="product-category">
              {item.category || "Category"}
            </span>
            <h3>
              {item.product_name ||
                item.title ||
                item.name ||
                "Product"}
            </h3>
            <div className="product-meta-row">
              <span className="meta-label">
                Brand:
              </span>
              <span className="meta-value">
                {item.brand_name || "Brand"}
              </span>
            </div>
            <div className="product-meta-row">
              <span className="meta-label">
                Qty:
              </span>
              <span className="meta-value">
                {item.product_quantity ?? 0}
              </span>
            </div>
            <p className="product-description">
              {item.description ||
                "No description available."}
            </p>

            <ul className="product-bullets">
              {Array.isArray(item.bullet_points)
                ? item.bullet_points
                  .filter(Boolean)
                  .map((point, idx) => (
                    <li key={`${point}-${idx}`}>
                      {String(point).replace(/^•\s*/, "")}
                    </li>
                  ))
                : typeof item.bullet_points === "string"
                  ? item.bullet_points
                    .split("\n")
                    .filter(Boolean)
                    .map((point, idx) => (
                      <li key={`${point}-${idx}`}>
                        {point.replace(/^•\s*/, "")}
                      </li>
                    ))
                  : null}
            </ul>

            <div className="product-price-row">
              <span className="product-price">
                $
                {Number(
                  item.product_price ??
                  0
                ).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="wishlist-actions">
            <button type="button">
              ADD TO CART
            </button>
            <button type="button" onClick={() => deletetingData(item.product_id)}>
              DELETE
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WishListPage;

