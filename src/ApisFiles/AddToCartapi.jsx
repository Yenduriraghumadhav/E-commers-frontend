import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useAddToCartAPI = () => {

    const navigate = useNavigate();

    const getAddTOCARTList = async () => {

        const userEmail = localStorage.getItem("userEmail");

        try {

            const response = await axios.get(
                "http://localhost:8000/usersGETData",
                {
                    params: {
                        userEmail: userEmail
                    },
                    withCredentials: true,
                }
            );

            return response.data;

        } catch (error) {

            if (
                error.response?.status === 401 ||
                error.response?.status === 422
            ) {
                localStorage.removeItem("userEmail");
                localStorage.removeItem("role");
                navigate("/UsersLogin");
                return null;
            }

            console.error(
                "Error:",
                error.response?.data || error.message
            );

            throw error;
        }
    };


    const deleteADDTOCART = async (productID) => {

        const userEmail = localStorage.getItem("userEmail");

        try {

            const response = await axios.delete(
                "http://localhost:8000/usersDataDelete",
                {
                    params: {
                        userEmail: userEmail,
                        productId: productID
                    },
                    withCredentials: true,
                }
            );

            return response.data;

        } catch (error) {

            if (
                error.response?.status === 401 ||
                error.response?.status === 422
            ) {
                localStorage.removeItem("userEmail");
                localStorage.removeItem("role");
                navigate("/UsersLogin");
                return null;
            }

            console.error(
                "Error:",
                error.response?.data || error.message
            );

            throw error;
        }
    };


    const PostADDTOCART = async (productID, sellerID, quantityData = 1) => {
        const userEmail = localStorage.getItem("userEmail");
        if (!productID || !sellerID) {
            throw new Error("Product ID and seller ID are required to add this item to your cart.");
        }

        try {
            const response = await axios.post(
                "http://localhost:8000/users_ADDTOCART",
                {
                    product_id: productID,
                    Quantity: quantityData,
                    seller_id: sellerID
                },
                {
                    params: {
                        userEmail: userEmail
                    },
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error) {

            if (error.response?.status === 401) {
                localStorage.removeItem("userEmail");
                localStorage.removeItem("role");
                navigate("/UsersLogin");
                return null;
            }

            console.error(
                "Error:",
                error.response?.data || error.message
            );

            throw error;
        }
    };

    return {
        getAddTOCARTList,
        deleteADDTOCART,
        PostADDTOCART
    };
};