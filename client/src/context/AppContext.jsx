import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { dummyProducts } from "../assets/assets.js";
import toast from "react-hot-toast";
import axios from 'axios'

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

    const currency = import.meta.env.VITE_CURRENCY; // Fixed VITE_CURRENCY access

    const navigate = useNavigate();
    const [user, setUser] = useState(true);
    const [isSeller, setIsSeller] = useState(false);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState([]);

    const [cartItems, setCartItems] = useState([]); // Fixed destructuring issue

    //Fetch Seller Status
    const fetchSeller = async () => {
        try {
            const { data } = await axios.get('/api/seller/auth');
            if (data.success) {
                setIsSeller(true)
            } else {
                setIsSeller(false)
            }
        } catch (error) {
            console.log(error)
            setIsSeller(false)

        }
    }



    // Fetch all products
    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('/api/product/list')
            if (data.success) {
                setProducts(data.products)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)

        }
    };


    //fetch User Auth Status, User data & Cart items

    const fetchUser = async () => {
        try {
            const { data } = await axios.get('api/user/auth');
            if (data.success) {
                setUser(data.user);
                setCartItems(data.user.cartItems);
            } else {
                setUser(null);

            }
        } catch (error) {

            toast.error(error.message);
        }
    };




    // Add product to cart
    const addToCart = (itemId) => { // Added itemId parameter
        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            cartData[itemId] += 1;
        } else {
            cartData[itemId] = 1;
        }

        setCartItems(cartData);
        toast.success("Added to cart");
    };

    // Update cart item quantity
    const updateCartItem = (itemId, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId] = quantity;
        setCartItems(cartData);
        toast.success("Cart Updated");
    };

    // Remove product from cart
    const removeFromCart = (itemId) => {
        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            cartData[itemId] -= 1;
            if (cartData[itemId] === 0) {
                delete cartData[itemId];
            }
        }

        setCartItems(cartData);
        toast.success("Removed From Cart");
    };

    // Get Cart Item Count
    const getCartCount = () => {
        let totalCount = 0;
        for (const item in cartItems) {
            totalCount += cartItems[item];
        }

        return totalCount;
    }

    //Get Cart Total Amount
    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (cartItems[items] > 0) {
                totalAmount += itemInfo.offerPrice * cartItems[items]
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    }
    useEffect(() => {
        fetchUser()
        fetchSeller()
        fetchProducts();
    }, []);

    //update database cartItems
    useEffect(() => {
        const updateCart = async () => {
            try {
                const { data } = await axios.post('/api/cart/update', {
                    userId: user?._id,
                    cartItems,
                });
    
                if (!data.success) {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.message);
            }
        };
    
        if (user && user._id) {
            updateCart();
        }
    }, [cartItems]);
    

    const value = {
        navigate,
        user,
        setUser,
        isSeller,
        setIsSeller,
        showUserLogin,
        setShowUserLogin,
        products,
        currency,
        addToCart,
        updateCartItem,
        removeFromCart,
        cartItems,
        searchQuery,
        setSearchQuery,
        getCartCount,
        getCartAmount,
        axios,
        fetchProducts,
        fetchUser,
        setCartItems
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
