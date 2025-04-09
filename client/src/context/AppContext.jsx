import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const AppContextProvider = ({ Children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [seller, setSeller] = useState(false);
    const value = {navigate,user,setUser,seller,setSeller}

    return <AppContext.Provider value={value}>
        {Children}
    </AppContext.Provider>
}

export const useAppContext = () => {
    return useContext(AppContext)
}