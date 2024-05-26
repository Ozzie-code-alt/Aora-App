import { createContext, useState, useEffect, useContext } from "react";
import { getCurrentUser } from "../lib/appwrite";
//retain sessions by using context api
const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setisLoggedIn(true);
          setUser(res);
        } else {
          setisLoggedIn(false);
          setUser(null);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setisLoading(false));
  }, []);
  return <GlobalContext.Provider value={{
    isLoggedIn,
    setisLoggedIn,
    user,
    setUser,
    isLoading,
  }}>{children}</GlobalContext.Provider>;
};


