import React, {useState,createContext,useContext} from "react";


//test Auth
const AuthContext = createContext();

export function AuthProvider({ children }) {

    return  (
        <AuthContext.Provider  value={{ user, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}