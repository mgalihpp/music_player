import { PropTypes } from "prop-types";
import { createContext, useContext, useState } from "react";
import { api } from "./../utils";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(false);
  const [userId, setUserId] = useState(localStorage.getItem("user_id") || null);
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const getUser = async () => {
    try {
      const res = await fetch(`${api}user?id=${userId}`, {
        method: "GET",
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.username) {
          setUserInfo(data);
          setUser(true);
        } else {
          setUser(false);
        }
      } else {
        throw new Error("Failed to fetch user info");
      }
    } catch (error) {
      setUser(false);
      localStorage.clear("user_id");
      console.log(error);
    }
  };

  // useEffect(() => {
  //   if (userId !== null && isLoading) {
  //     getUser();
  //     setTimeout(() => {
  //       setIsLoading(false);
  //     }, 1000);
  //   }
  // }, [userId, isLoading]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        userId,
        setUserId,
        userInfo,
        isLoading,
        setIsLoading,
        getUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
