import { PropTypes } from "prop-types";
import { createContext, useContext, useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher, api } from "../lib/utils";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [updateUser, setUpdateUser] = useState(false);
  const token = localStorage.getItem("access_token");

  const {
    data: userData,
    mutate,
    error,
  } = useSWR(user && `${api}user`, (url) => fetcher(url, token), {
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (userData) {
      setUserInfo(userData);
      setUser(true);
    } else if (error) {
      setUser(false);
      localStorage.clear("access_token");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }, [userData, error]);

  useEffect(() => {
    if (updateUser) {
      mutate();
      setTimeout(() => {
        setUpdateUser(false);
      }, 1000);
    }
  }, [updateUser, user, mutate]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        userInfo,
        updateUser,
        setUpdateUser,
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
