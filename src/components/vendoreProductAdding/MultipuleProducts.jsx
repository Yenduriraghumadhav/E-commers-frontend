import React, { useRef, useState } from "react";
import axios from "axios";
import "./multipuleProducts.css";

const MultipuleProducts = () => {
    const fileInputRef = useRef(null);

    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const API_URL = "http://localhost:8000";

    // -----------------------------------
    // Download Excel Template
    // -----------------------------------
    const handleDownloadTemplate = async () => {
        try {
            setDownloading(true);
            setMessage("");
            setError("");

            const response = await axios.get(
                `${API_URL}/download_vendore_productsExcel_template`,
                {
                    responseType: "blob",
                    withCredentials: true,
                }
            );

            const blob = new Blob(
                [response.data],
                {
                    type:
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                }
            );

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = "vendor_products_template.xlsx";

            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);

            setMessage("Excel template downloaded successfully.");
        } catch (err) {
            console.error("Template download error:", err);

            setError(
                err.response?.data?.detail ||
                "Unable to download the Excel template."
            );
        } finally {
            setDownloading(false);
        }
    };

    // -----------------------------------
    // Validate File
    // -----------------------------------
    const validateFile = (file) => {
        if (!file) {
            return false;
        }

        const allowedExtensions = [".xlsx", ".xls"];

        const fileName = file.name.toLowerCase();

        const isValid = allowedExtensions.some((extension) =>
            fileName.endsWith(extension)
        );

        if (!isValid) {
            setError("Please select an Excel file (.xlsx or .xls).");
            setSelectedFile(null);
            return false;
        }

        // Optional 10 MB limit
        if (file.size > 10 * 1024 * 1024) {
            setError("File size must be less than 10 MB.");
            setSelectedFile(null);
            return false;
        }

        setError("");
        setMessage("");
        setSelectedFile(file);

        return true;
    };

    // -----------------------------------
    // File Selection
    // -----------------------------------
    const handleFileChange = (event) => {
        const file = event.target.files[0];

        validateFile(file);
    };

    // -----------------------------------
    // Drag Events
    // -----------------------------------
    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();

        setIsDragging(false);

        const file = event.dataTransfer.files[0];

        validateFile(file);
    };

    // -----------------------------------
    // Open File Browser
    // -----------------------------------
    const handleChooseFile = () => {
        fileInputRef.current?.click();
    };

    // -----------------------------------
    // Upload Excel
    // -----------------------------------
    const handleUpload = async () => {
        if (!selectedFile) {
            setError("Please select an Excel file first.");
            return;
        }

        try {
            setUploading(true);
            setMessage("");
            setError("");

            const formData = new FormData();

            formData.append("file", selectedFile);

            /*
             * IMPORTANT:
             *
             * Your FastAPI API expects:
             *
             * vendorEmail
             * file
             * vendor_access_token from Cookie
             *
             * If vendorEmail is stored in localStorage:
             */
            const vendorEmail =
                localStorage.getItem("vendore_email");

            if (!vendorEmail) {
                setError("Vendor email not found. Please login again.");
                return;
            }

            const response = await axios.post(
                `${API_URL}/upload_vendore_productsExcel`,
                formData,
                {
                    params: {
                        vendorEmail: vendorEmail,
                    },

                    withCredentials: true,

                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log("Upload response:", response.data);

            setMessage(
                response.data?.message ||
                "Products uploaded successfully."
            );

            setSelectedFile(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

        } catch (err) {
            console.error("Excel upload error:", err);

            setError(
                err.response?.data?.detail ||
                "Unable to upload the Excel file."
            );
        } finally {
            setUploading(false);
        }
    };

    // -----------------------------------
    // Remove Selected File
    // -----------------------------------
    const handleRemoveFile = () => {
        setSelectedFile(null);
        setError("");
        setMessage("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // -----------------------------------
    // Format File Size
    // -----------------------------------
    const formatFileSize = (bytes) => {
        if (bytes < 1024) {
            return `${bytes} B`;
        }

        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(1)} KB`;
        }

        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className="vendor-excel-page">

            <div className="vendor-excel-container">

                {/* Header */}
                <div className="excel-page-header">

                    <div className="header-icon">
                        📊
                    </div>

                    <div>
                        <h1>Bulk Product Upload</h1>

                        <p>
                            Add multiple products quickly using an Excel file
                        </p>
                    </div>

                </div>


                {/* Main Card */}
                <div className="excel-card">

                    {/* Step 1 */}
                    <div className="excel-step">

                        <div className="step-number">
                            1
                        </div>

                        <div className="step-content">

                            <h2>Download the Excel Template</h2>

                            <p>
                                Start by downloading our product template.
                                The template contains all the required columns
                                for adding your products.
                            </p>

                            <button
                                className="download-template-btn"
                                onClick={handleDownloadTemplate}
                                disabled={downloading}
                            >
                                {downloading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Downloading...
                                    </>
                                ) : (
                                    <>
                                        ⬇️ Download Excel Template
                                    </>
                                )}
                            </button>

                        </div>

                    </div>


                    <div className="step-divider"></div>


                    {/* Step 2 */}
                    <div className="excel-step">

                        <div className="step-number">
                            2
                        </div>

                        <div className="step-content">

                            <h2>Fill Product Details</h2>

                            <p>
                                Open the downloaded Excel file and enter your
                                product information in the appropriate columns.
                            </p>

                            <div className="instruction-box">

                                <div className="instruction-icon">
                                    💡
                                </div>

                                <div>
                                    <strong>Important</strong>
                                    <p>
                                        Do not change the column names in the
                                        template. Enter your product data below
                                        the existing headers. <br />
                                        We have provided sample product details in the Download Excel Template. Please follow the examples
                                        and adhere to the specified rules and guidelines when entering your product details. <br />

                                        <span >Note : Please remove provided sample product details EXAMPLE in the Download Excel Template </span>

                                    </p>
                                </div>

                            </div>

                        </div>

                    </div>


                    <div className="step-divider"></div>


                    {/* Step 3 */}
                    <div className="excel-step">

                        <div className="step-number">
                            3
                        </div>

                        <div className="step-content">

                            <h2>Upload Your Excel File</h2>

                            <p>
                                Select the completed Excel file or drag and
                                drop it below.
                            </p>


                            {/* Upload Area */}
                            <div
                                className={`excel-drop-area ${isDragging
                                    ? "dragging"
                                    : ""
                                    } ${selectedFile
                                        ? "file-selected"
                                        : ""
                                    }`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={
                                    !selectedFile
                                        ? handleChooseFile
                                        : undefined
                                }
                            >

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".xlsx,.xls"
                                    onChange={handleFileChange}
                                    hidden
                                />

                                {!selectedFile ? (
                                    <>

                                        <div className="upload-icon">
                                            📁
                                        </div>

                                        <h3>
                                            Drag & Drop your Excel file
                                        </h3>

                                        <p>
                                            or
                                        </p>

                                        <button
                                            type="button"
                                            className="choose-file-btn"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                handleChooseFile();
                                            }}
                                        >
                                            Choose File
                                        </button>

                                        <span className="supported-files">
                                            Supported formats: .xlsx, .xls
                                            <br />
                                            Maximum size: 10 MB
                                        </span>

                                    </>
                                ) : (
                                    <div className="selected-file">

                                        <div className="excel-file-icon">
                                            📗
                                        </div>

                                        <div className="file-details">

                                            <h3>
                                                {selectedFile.name}
                                            </h3>

                                            <p>
                                                {formatFileSize(
                                                    selectedFile.size
                                                )}
                                            </p>

                                        </div>

                                        <button
                                            type="button"
                                            className="remove-file-btn"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                handleRemoveFile();
                                            }}
                                        >
                                            ✕
                                        </button>

                                    </div>
                                )}

                            </div>


                            {/* Upload Button */}
                            {selectedFile && (
                                <button
                                    className="upload-excel-btn"
                                    onClick={handleUpload}
                                    disabled={uploading}
                                >
                                    {uploading ? (
                                        <>
                                            <span className="spinner"></span>
                                            Uploading Products...
                                        </>
                                    ) : (
                                        <>
                                            🚀 Upload Products
                                        </>
                                    )}
                                </button>
                            )}

                        </div>

                    </div>


                    {/* Success Message */}
                    {message && (
                        <div className="success-message">
                            <span>✓</span>
                            <p>{message}</p>
                        </div>
                    )}


                    {/* Error Message */}
                    {error && (
                        <div className="error-message">
                            <span>⚠</span>
                            <p>{error}</p>
                        </div>
                    )}

                </div>


                {/* Bottom Info */}
                <div className="excel-footer-info">

                    <div>
                        🔒
                        <span>
                            Your uploaded file is securely processed.
                        </span>
                    </div>

                    <div>
                        📋
                        <span>
                            Make sure all required fields are completed.
                        </span>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default MultipuleProducts;