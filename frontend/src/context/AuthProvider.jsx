import { useState } from "react";
import cookies from "js-cookie";
import { AuthContext } from "./AuthContext";

const USER_STORAGE_KEY = "authUser";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => cookies.get("authToken"));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch {
      localStorage.removeItem(USER_STORAGE_KEY);
      return null;
    }
  });

  const saveAuthentication = (authToken, authenticatedUser) => {
    cookies.set("authToken", authToken);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authenticatedUser));
    setToken(authToken);
    setUser(authenticatedUser);
  };

  const logout = () => {
    cookies.remove("authToken");
    localStorage.removeItem(USER_STORAGE_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(token),
        token,
        user,
        saveAuthentication,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
