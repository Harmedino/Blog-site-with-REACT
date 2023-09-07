import { Link, useNavigate, useSearchParams } from "react-router-dom";

import classes from "./AuthForm.module.css";
import { useState } from "react";
import axios from "axios";
import Message from "../UI/Message";
import { publicRequest } from "../request";

function AuthForm() {
  const [searchParams] = useSearchParams();
  const isLogin = searchParams.get("mode") === "login";
  const mode = searchParams.get("mode");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  
  const publicReq = publicRequest();

  const initialFormData = {
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    password: "",
  };

  const [userdata, setUserData] = useState(initialFormData);

  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    setUserData({ ...userdata, [name]: value });
  }

  const handleResetPassword = () => {
    setUserData((prevData) => ({
      ...prevData,
      password: "", // Reset only the password field
    }));
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  async function handleClick(event) {
    event.preventDefault();
    setIsLoading(true);

    axios.defaults.withCredentials = true;

    try {
      if (mode === "signup") {
        try {
          const { data } = await publicReq.post(
            "/register",
            JSON.stringify(userdata),
            config
          );
          setMessage(data.message);

          setTimeout(() => {
            navigate("/Auth?mode=login");
          }, 3000);
        } catch (error) {
          setMessage(error.response.data.message);
          setTimeout(() => {
            setMessage("");
          }, 3000);
        }
      } else if (mode === "login") {
        const response = await publicReq.post(
          "/login",
          JSON.stringify(userdata),
          config
        );
        if (response) {
          setMessage(response.data.message);
          setTimeout(() => {
            navigate("/blogList");
            setMessage("");
          }, 2000);
        }
       
      }
    } catch (error) {
      console.log(error)
      setMessage(error.response.data.message);
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }

    setIsLoading(false);
    handleResetPassword();
  }

  return (
    <>
      {message && <Message message={message}></Message>}
      <form method="post" className={classes.form} onSubmit={handleClick}>
        <h1>{isLogin ? "Log in" : "Create a new user"}</h1>

        {!isLogin && (
          <>
            <p>
              <label htmlFor="fullname">First Name:</label>
              <input
                id="firstname"
                type="text"
                name="firstname"
                required
                value={userdata.firstname}
                placeholder="firstname"
                onChange={handleChange}
              />
            </p>
            <p>
              <label htmlFor="fullname">Last Name:</label>
              <input
                id="lastname"
                type="text"
                name="lastname"
                value={userdata.lastname}
                required
                placeholder="lastname"
                onChange={handleChange}
              />
            </p>
            <p>
              <label htmlFor="username">Username:</label>
              <input
                id="username"
                type="username"
                name="username"
                value={userdata.username}
                required
                placeholder="username"
                onChange={handleChange}
              />
            </p>
          </>
        )}
        <p>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            name="email"
            alue={userdata.email}
            required
            placeholder="Email"
            onChange={handleChange}
          />
        </p>
        <p>
          <label htmlFor="image">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={userdata.password}
            required
            placeholder="password"
            onChange={handleChange}
          />
        </p>
        <div className={classes.actions}>
          <Link
            to={`?mode=${isLogin ? "signup" : "login"}`}
            onClick={handleResetPassword}
          >
            {isLogin ? "Create new user" : "Login"}
          </Link>
          <button>{isLoading ? "Saving" : "Save"}</button>
        </div>
      </form>
    </>
  );
}

export default AuthForm;
