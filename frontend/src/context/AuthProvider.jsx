import { useState } from "react";
import cookies from "js-cookie";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => cookies.get("authToken"));
  const [user, setUser] = useState(null);

  const saveAuthentication = (authToken, authenticatedUser) => {
    cookies.set("authToken", authToken);
    setToken(authToken);
    setUser(authenticatedUser);
  };

  const logout = () => {
    cookies.remove("authToken");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(token),
        user,
        saveAuthentication,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
