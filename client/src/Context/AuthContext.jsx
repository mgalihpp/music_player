import { PropTypes } from "prop-types";
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(false);
  const [userId, setUserId] = useState(localStorage.getItem("user_id") || null);

  return (
    <AuthContext.Provider value={{ user, setUser, userId, setUserId }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
