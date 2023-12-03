import { PropTypes } from "prop-types";
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "./../utils";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(false);
  const [userId, setUserId] = useState(localStorage.getItem("user_id") || null);
  const [userInfo, setUserInfo] = useState({});

  console.log(userInfo);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`${api}user?id=${userId}`, {
          method: "GET",
        });
        if (res.ok) {
          const data = await res.json();
          setUserInfo(data);
        } else {
          throw new Error("Failed to fetch user info");
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (userId !== null) getUser();
  }, [userId]);

  return (
    <AuthContext.Provider
      value={{ user, setUser, userId, setUserId, userInfo }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
