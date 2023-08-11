import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import ResponseDataContext from "./contex";

export function AuthProvider({ children }) {
  const [message, setMessage] = useState();
  const [dispay, setDisplay] = useState();

  const token = localStorage.getItem("authToken");

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  useEffect(() => {
    activeUser();
  }, []);

  const activeUser = async () => {
    if (token) {
      try {
        const response = await axios.post(
          "http://localhost:5000/verifyToken",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setMessage(response.data.message);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const login = async (userdata, mode, navigate) => {
    try {
      if (mode === "signup") {
        const { data } = await axios.post(
          "http://localhost:5000/register",
          JSON.stringify(userdata),
          config
        );
        localStorage.setItem("authToken", data.token);
        setDisplay(data.message);
        setTimeout(() => {
          navigate("/blogList");
        }, 2000);
      } else if (mode === "login") {
        const response = await axios.post(
          "http://localhost:5000/login",
          JSON.stringify(userdata),
          config
        );
        localStorage.setItem("authToken", response.data.token);
        setDisplay(response.data.message);
        setMessage(response.data);
        setTimeout(() => {
          navigate("/blogList");
        }, 2000);
      }
    } catch (error) {
      setDisplay(error.response.data.error);
      setTimeout(() => {}, 3000);
    }
  };
  console.log(message);

  return (
    <ResponseDataContext.Provider value={{ message, activeUser, login }}>
      {children}
    </ResponseDataContext.Provider>
  );
}

export default AuthProvider;
