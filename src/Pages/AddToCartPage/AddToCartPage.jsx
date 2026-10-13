import React, { useEffect, useState } from 'react'
import "./addToCartPage.css";
import { useAddToCartAPI } from "../../ApisFiles/AddToCartapi";
import UsersOrdersModal from "./UsersOrdersModal";

const AddToCartPage = () => {
  const { getAddTOCARTList, deleteADDTOCART } = useAddToCartAPI();
  const [AddToCart, setAddToCart] = useState([]);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [cart, setCart] = useState([]);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  useEffect(() => {
    loadWishlist();
  }, [])

  const loadWishlist = async () => {
    try {
      const responseData = await getAddTOCARTList();
      if (!responseData) {
        return;
      }
      setAddToCart(responseData.products)
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
        "AddToCart Error:",
        error.response?.data || error.message
      );
    }
  };


  const deletetingData = async (productID) => {
    try {
      const checkingDeleteData = await deleteADDTOCART(productID);
      await loadWishlist();
    } catch (error) {
      console.log(error);
    }
  }

  if (!AddToCart || AddToCart.length === 0) {
    return (
      <div className="addToCartlist-empty">
        <div className="AddToCart-empty-panel">
          <span className="addToCartlist-info-icon" aria-hidden="true">i</span>
          <h2>Your cart is empty</h2>
          <p>{errorMessage || message || "Add products to your cart to see them here."}</p>
        </div>
      </div>
    );
  }

  const totalPrice = AddToCart.reduce(
    (total, item) => {
      const price = Number(item.product_price ?? 0);
      const quantity = Number(item.quantity ?? 1);

      return total + (price * quantity);
    },
    0
  );

  const increaseQuantity = (productId) => {
    setAddToCart((prevCart) =>
      prevCart.map((item) =>
        item.product_id === productId
          ? {
            ...item,
            quantity: Number(item.quantity ?? 1) + 1
          }
          : item
      )
    );
  };


  const decreaseQuantity = (productId) => {
    setAddToCart((prevCart) =>
      prevCart.map((item) =>
        item.product_id === productId
          ? {
            ...item,
            quantity: Math.max(
              1,
              Number(item.quantity ?? 1) - 1
            )
          }
          : item
      )
    );
  };
  return (
    <>
      <div className="Addlist-cards">
        {AddToCart.map((item, index) => (
          <article
            key={item.product_id ?? `${item.product_name ?? "product"}-${index}`}
            className="products-card cart-product-card"
          >
            <button type="button" className="wishlist-button" aria-label="Add to wishlist">
              ♡
            </button>

            <div className="product-category">{item.category || "Category"}</div>
            <h3>{item.product_name || item.title || item.name || "Product"}</h3>

            <div className="product-meta-row">
              <span className="meta-value">Brand: {item.brand_name || "Brand"}</span>
            </div>

            <div className="product-meta-row product-meta-row--compact">
              <span className="product-price">MRP: ${Number(item.product_price ?? 0).toFixed(2)}</span>
            </div>

            <p className="product-description">
              {item.description || "No description available."}
            </p>

            <div className="product-footer">
              <div className="quantity-control">

                <button
                  type="button"
                  className="quantity-btn"
                  aria-label="Decrease quantity"
                  onClick={() => decreaseQuantity(item.product_id)}
                >
                  -
                </button>

                <span className="quantity-value">
                  {item.quantity ?? 1}
                </span>

                <button
                  type="button"
                  className="quantity-btn"
                  aria-label="Increase quantity"
                  onClick={() => increaseQuantity(item.product_id)}
                >
                  +
                </button>

              </div>
              <button type="button" className="add-to-cart-btn" onClick={() => { deletetingData(item.product_id) }}>Remove</button>
            </div>
          </article>
        ))}
      </div>
      
      <div className="cart-checkout-action">
        <h2>Total MRP <span>${totalPrice.toFixed(2)}</span></h2>
        <button type="button" className="addToCarts" onClick={() => setIsOrderModalOpen(true)}>
          Buy Now
        </button>
      </div>
      {isOrderModalOpen && (
        <UsersOrdersModal
          items={AddToCart}
          totalPrice={totalPrice}
          onClose={() => setIsOrderModalOpen(false)}
        />
      )}
    </>
  )
}

export default AddToCartPage