import { PropTypes } from "prop-types";
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "./../utils";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [updateUser, setUpdateUser] = useState(false);
  const token = localStorage.getItem("access_token");

  const getUser = async () => {
    try {
      const res = await fetch(`${api}user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();

        setUserInfo(data);
        setUser(true);
      } else {
        setUser(false);
        throw new Error("Failed to fetch user info");
      }
    } catch (error) {
      setUser(false);
      localStorage.clear("access_token");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      console.error(error);
    }
  };

  useEffect(() => {
    if (user) {
      getUser();
    }
  }, [user]);

  useEffect(() => {
    if (updateUser) {
      getUser();
      setTimeout(() => {
        setUpdateUser(false);
      }, 1000);
    }
  }, [updateUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        userInfo,
        updateUser,
        setUpdateUser,
        getUser,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
