import { createContext, useContext, useEffect, useState } from "react";

import {
  getToken,
  removeToken,
  setToken,
  setUser as saveUser,
  removeUser,
} from "../utils/auth";

import {
  signinUser,
  signupUser,
  getCurrentUser,
} from "../services/authService";


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  // ================= SIGNUP =================

  const signup = async (userData) => {

    const data = await signupUser(userData);

    if (data.success) {

      setToken(data.token);

      saveUser(data.user);

      setUser(data.user);
    }

    return data;
  };


  // ================= SIGNIN =================

  const signin = async (userData) => {

    const data = await signinUser(userData);

    if (data.success) {

      setToken(data.token);

      saveUser(data.user);

      setUser(data.user);
    }

    return data;
  };


  // ================= LOGOUT =================

  const logout = () => {

    removeToken();

    removeUser();

    setUser(null);
  };


  // ================= LOAD USER =================

  const loadUser = async () => {

    const token = getToken();

    if (!token) {
      setLoading(false);
      return;
    }

    try {

      const data = await getCurrentUser();

      if (data.success) {

        saveUser(data.user);

        setUser(data.user);
      }

    } catch (error) {

      removeToken();
      removeUser();
      setUser(null);

    } finally {

      setLoading(false);
    }
  };


  useEffect(() => {
    loadUser();
  }, []);


  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signup,
        signin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);