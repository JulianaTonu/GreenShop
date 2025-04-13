import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

    const navigate = useNavigate();
    const [user,setUser] = useState(true);
    const [seller,setSeller] = useState(false);
    const [showUserLogin,setShowUserLogin] = useState(false);

    const value = {
        navigate,
        user,
        setUser,
        seller,
        setSeller,
        showUserLogin,
        setShowUserLogin
    }

    return <AppContext.Provider value={[value]}>
        {children}
    </AppContext.Provider>
}

export const useAppContext = () => useContext(AppContext);
