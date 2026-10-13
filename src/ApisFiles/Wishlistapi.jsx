import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useWishlistAPI = () => {

    const navigate = useNavigate();

    const getWishList = async () => {

        const userEmail = localStorage.getItem("userEmail");

        try {

            const response = await axios.get(
                "http://localhost:8000/viewWishList",
                {
                    params: {
                        userEmail: userEmail,
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


    const deleteWishList = async (productID) => {

        const userEmail = localStorage.getItem("userEmail");

        try {

            const response = await axios.delete(
                "http://localhost:8000/wishlistremove",
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

    const PostWishList = async (productID) => {

        const userEmail = localStorage.getItem("userEmail");

        try {

            const response = await axios.post(
                "http://localhost:8000/whishList",
                {},
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


    return {
        getWishList,
        deleteWishList,
        PostWishList
    };
};