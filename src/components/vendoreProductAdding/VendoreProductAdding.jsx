import React, { useState } from "react";
import axios from "axios";
import "./vendoreProductAdding.css";
import { useNavigate } from "react-router-dom";

const VendoreProductAdding = () => {
    const [formData, setFormData] = useState({
        product_name: "",
        brand_name: "",
        category: "",
        description: "",
        bullet_points: "",
        product_price: "",
        product_mrp: "",
        product_quantity: "",
        product_images: "",
    });
    const navigating = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        const vendorEmail =
            localStorage.getItem("vendore_email") ||
            localStorage.getItem("vendore_products");

        if (!vendorEmail || vendorEmail === "undefined" || vendorEmail === "null") {
            setError("Vendor email not found. Please login again.");
            return;
        }

        try {
            setLoading(true);

            const bulletPoints = formData.bullet_points
                .split("\n")
                .map((item) => item.trim())
                .filter((item) => item !== "");

            const productImages = formData.product_images
                .split("\n")
                .map((item) => item.trim())
                .filter((item) => item !== "");

            const productData = {
                product_name: formData.product_name,
                brand_name: formData.brand_name,
                category: formData.category,
                description: formData.description,
                bullet_points: bulletPoints,
                product_price: Number(formData.product_price),
                product_mrp: Number(formData.product_mrp),
                product_quantity: Number(formData.product_quantity),
                product_images: productImages,
            };

            const response = await axios.post("http://localhost:8000/vendore_products", productData, {
                params: { email: vendorEmail },
                withCredentials: true,
            })

            console.log("Product created:", response.data);

            setMessage("Product added successfully!");

            setFormData({
                product_name: "",
                brand_name: "",
                category: "",
                description: "",
                bullet_points: "",
                product_price: "",
                product_mrp: "",
                product_quantity: "",
                product_images: "",
            });
        } catch (err) {
            if (
                error.response?.status === 401 ||
                error.response?.status === 422
            ) {
                localStorage.removeItem("vendore_email");
                localStorage.removeItem("role");
                navigate("/VendoreLogin");
                return null;
            }

            setError(
                err.response?.data?.detail ||
                "Unable to add product. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    async function navigatetoMultipuleProductsPage() {
        navigating("/multiProdctAdding")
    }

    return (
        <>
            <div className="Multipuleclassess">
                <button className="multiplebutton" onClick={navigatetoMultipuleProductsPage}>ADD Multipule Products</button>
            </div>
            <div className="vendor-product-page">
                <div className="vendor-product-card">
                    <div className="vendor-product-header">
                        <span className="product-header-icon">＋</span>
                        <div>
                            <h1>Add New Product</h1>
                            <p>Enter your product information below</p>
                        </div>
                    </div>

                    {message && (
                        <div className="success-message">
                            ✓ {message}
                        </div>
                    )}

                    {error && (
                        <div className="error-message">
                            ⚠ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        <div className="form-section">
                            <h2>Product Information</h2>

                            <div className="form-grid">

                                <div className="form-group">
                                    <label>Product Name *</label>
                                    <input
                                        type="text"
                                        name="product_name"
                                        value={formData.product_name}
                                        onChange={handleChange}
                                        placeholder="e.g. Samsung Galaxy S25"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Brand Name *</label>
                                    <input
                                        type="text"
                                        name="brand_name"
                                        value={formData.brand_name}
                                        onChange={handleChange}
                                        placeholder="e.g. Samsung"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Category *</label>
                                    <input
                                        type="text"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        placeholder="e.g. Smartphones"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Quantity *</label>
                                    <input
                                        type="number"
                                        name="product_quantity"
                                        value={formData.product_quantity}
                                        onChange={handleChange}
                                        placeholder="e.g. 25"
                                        min="1"
                                        required
                                    />
                                </div>

                            </div>

                            <div className="form-group full-width">
                                <label>Description *</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe your product..."
                                    rows="5"
                                    required
                                />
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="form-section">
                            <h2>Pricing</h2>

                            <div className="form-grid">

                                <div className="form-group">
                                    <label>MRP *</label>

                                    <div className="input-with-symbol">
                                        <span>₹</span>

                                        <input
                                            type="number"
                                            name="product_mrp"
                                            value={formData.product_mrp}
                                            onChange={handleChange}
                                            placeholder="79999"
                                            min="0"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Selling Price *</label>

                                    <div className="input-with-symbol">
                                        <span>₹</span>

                                        <input
                                            type="number"
                                            name="product_price"
                                            value={formData.product_price}
                                            onChange={handleChange}
                                            placeholder="74999"
                                            min="0"
                                            required
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Bullet Points */}
                        <div className="form-section">
                            <h2>Product Highlights</h2>

                            <div className="form-group">
                                <label>Bullet Points</label>

                                <textarea
                                    name="bullet_points"
                                    value={formData.bullet_points}
                                    onChange={handleChange}
                                    placeholder={
                                        "6.2-inch AMOLED display\n12GB RAM\n256GB storage\n50MP camera\nFast charging support"
                                    }
                                    rows="6"
                                />

                                <small>
                                    Enter one feature per line.
                                </small>
                            </div>
                        </div>

                        {/* Images */}
                        {/* <div className="form-section">
                        <h2>Product Images</h2>

                        <div className="form-group">
                            <label>Image URLs</label>

                            <textarea
                                name="product_images"
                                value={formData.product_images}
                                onChange={handleChange}
                                placeholder={
                                    "https://example.com/product-image-1.jpg\nhttps://example.com/product-image-2.jpg"
                                }
                                rows="4"
                            />

                            <small>
                                Enter one image URL per line.
                            </small>
                        </div>
                    </div> */}

                        {/* Backend Generated Fields */}
                        {/* <div className="automatic-info">
                        <div className="automatic-icon">🔐</div>

                        <div>
                            <strong>Automatic Information</strong>

                            <p>
                                Product ID will be generated automatically by the server.
                                Your seller ID will also be retrieved from your vendor account.
                            </p>
                        </div>
                    </div> */}

                        {/* Submit */}
                        <button
                            type="submit"
                            className="add-product-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                "Adding Product..."
                            ) : (
                                <>
                                    <span>＋</span>
                                    Add Product
                                </>
                            )}
                        </button>

                    </form>
                </div>
            </div>
        </>

    );
};

export default VendoreProductAdding;