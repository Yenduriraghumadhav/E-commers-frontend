import React, { useEffect, useState } from "react";
import "./UsersHomePage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAddToCartAPI } from "../../ApisFiles/AddToCartapi";
import { useWishlistAPI } from "../../ApisFiles/Wishlistapi"

const UsersHomePage = () => {
  const { PostADDTOCART } = useAddToCartAPI();
  const { PostWishList } = useWishlistAPI();
  const emails = localStorage.getItem("userEmail")
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  console.log("products : ", products);

  const getProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get("http://localhost:8000/TProductsDL", {
        params: {
          userEmail: emails,
        },
        withCredentials: true,
      });

      const productList = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.products)
          ? response.data.products
          : Array.isArray(response.data?.data)
            ? response.data.data
            : Array.isArray(response.data?.productDetails)
              ? response.data.productDetails
              : [];

      setProducts(productList);
    } catch (error) {
      setError(error.response?.data?.message || error.message || "Failed to load products.");
      if (error.response?.status === 401 || error.response?.status === 422) {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("role");
        navigate("/UsersLogin");
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const wishlistProduct = async (productID) => {
    console.log("productID : ", productID);
    try {
      await PostWishList(productID);
    } catch (error) {
      console.log(error);
    }
  };

  const postindData = async (productID, sellerID) => {
    return PostADDTOCART(productID, sellerID);
  };

  useEffect(() => {
    getProducts();
  }, []);

  if (loading) {
    return (
      <div className="status">
        <div className="loader"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return <div className="status error">{error}</div>;
  }

  return (
    <>
      {/* <div className="vendor-search">
          <span className="search-icon">⌕</span>
          <input
            type="text"
            placeholder="Search products, orders..."
            aria-label="Search products and orders"
          />
          <span className="search-shortcut">⌘ K</span>
        </div> */}

      <div className="shop-page">
        <div className="product-grid">
          {products.map((product, index) => (
            <ProductCard
              key={product.product_id ?? product.id ?? index}
              product={product}
              wishlistProduct={wishlistProduct}
              postindData={postindData}
            />
          ))}

        </div>
      </div>
    </>

  );
};

const ProductCard = ({ product, wishlistProduct, postindData }) => {
  console.log("Full product object:", product);
  const [showMore, setShowMore] = useState(false);
  const [liked, setLiked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState("");

  const productName = product.product_name || product.title || "Product Name";
  const brandName = product.brand_name || product.brand || "Brand";
  const categoryName = product.category || product.category_name || "Category";
  const descriptionText = product.description || product.product_description || "No description available";
  const priceValue = Number(product.product_price ?? product.price ?? 0);
  const mrpValue = Number(product.product_mrp ?? product.mrp ?? product.price ?? priceValue);
  const quantityValue = Number(product.product_quantity ?? product.quantity ?? 0);
  const imageUrl = product.image || product.product_image || product.image_url || "";
  const bulletPoints = Array.isArray(product.bullet_points)
    ? product.bullet_points
    : product.bulletPoints
      ? product.bulletPoints
      : [];

  const productID =
    product.product_id ??
    product.product_Id ??
    product.productId;

  console.log("productID : ", productID);

  const sellerID = product.seller_id ?? product.seller_Id;

  const addToCart = async () => {
    setAddError("");
    setIsAdding(true);
    try {
      const response = await postindData(productID, sellerID);
      if (response) {
        setIsAdded(true);
      }
    } catch (error) {
      console.error("Add to cart failed:", error.response?.data || error.message);
      const details = error.response?.data?.detail;
      setAddError(
        Array.isArray(details)
          ? details.map((item) => item.msg || JSON.stringify(item)).join(", ")
          : details || error.response?.data?.message || error.message || "Could not add this product to your cart."
      );
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <article className="product-card">
      <div className="product-image">
        <button
          className={`wishlist ${liked ? "liked" : ""}`}
          onClick={() => {
            setLiked(!liked)
            wishlistProduct(productID);
          }}
          aria-label="Add to wishlist"
        >
          {liked ? "♥" : "♡"}
        </button>

        {/* {imageUrl ? (
          <img src={imageUrl} alt={productName} />
        ) : (
          <div className="product-image-placeholder">No Image</div>
        )} */}
      </div>

      <div className="product-content">
        <div className="product-category">{categoryName}</div>

        <h2 className="product-title">{productName}</h2>

        <div className="product-brand-row">
          <span className="product-brand-label">Brand:</span>
          <span className="product-brand">{brandName}</span>
        </div>

        <div className="product-meta-row">
          <span className="product-quantity">Qty: {quantityValue}</span> <br />
          <span className="product-mrp">MRP: ${mrpValue.toFixed(2)}</span>
        </div>

        <div className="description-wrapper">
          <p className={showMore ? "description expanded" : "description"}>
            {showMore
              ? descriptionText
              : descriptionText.length > 85
                ? `${descriptionText.substring(0, 85)}...`
                : descriptionText}
          </p>

          {descriptionText.length > 85 && (
            <button
              className="show-more"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? "Show less" : "Show more"}
              <span>{showMore ? "↑" : "→"}</span>
            </button>
          )}
        </div>

        {bulletPoints.length > 0 && (
          <ul className="product-bullets">
            {bulletPoints.slice(0, 3).map((point, index) => (
              <li key={`${point}-${index}`}>{point}</li>
            ))}
          </ul>
        )}

        <div className="product-bottom">
          <div className="price-box">
            <span className="price">${priceValue.toFixed(2)}</span>
          </div>

          <button
            className="add-button"
            onClick={() => addToCart(product.product_Id, product.seller_id)}
            disabled={isAdding || isAdded}
          >
            <span>{isAdding ? '…' : isAdded ? '✓' : '+'}</span>
            {isAdding ? 'Adding...' : isAdded ? 'Added' : 'Add to cart'}
          </button>
        </div>
        {addError && <p className="add-cart-error" role="alert">{addError}</p>}
      </div>
    </article>
  );
};

export default UsersHomePage;
