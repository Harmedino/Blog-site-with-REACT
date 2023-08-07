import { Link, useNavigate, useSearchParams } from "react-router-dom";

import classes from "./AuthForm.module.css";
import { useState } from "react";
import axios from "axios";
import Message from "../UI/Message";

function AuthForm() {
  const [searchParams] = useSearchParams();
  const isLogin = searchParams.get("mode") === "login";
  const mode = searchParams.get("mode");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const [userdata, setUserData] = useState();

  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    setUserData({ ...userdata, [name]: value });
  }

  const config = {
    headers: {
      "Content-Type": "application/json", // Set the appropriate content type
    },
  };

  async function handleClick(event) {
    setIsLoading(true);
    event.preventDefault();

    if (mode === "signup") {
      try {
        const { data } = await axios.post(
          "http://localhost:5000/register",
          JSON.stringify(userdata),
          config
        );
        setMessage(data.message);
        setTimeout(() => {
          setMessage("");
          navigate("/blogList");
        }, 2000);
      } catch (error) {
        console.log(error);
      }
    }
    setIsLoading(false);
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
                placeholder="fullname"
                onChange={handleChange}
              />
            </p>
            <p>
              <label htmlFor="fullname">Last Name:</label>
              <input
                id="lastname"
                type="text"
                name="lastname"
                required
                placeholder="fullname"
                onChange={handleChange}
              />
            </p>
            <p>
              <label htmlFor="username">Username:</label>
              <input
                id="username"
                type="username"
                name="username"
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
            required
            placeholder="password"
            onChange={handleChange}
          />
        </p>
        <div className={classes.actions}>
          <Link to={`?mode=${isLogin ? "signup" : "login"}`}>
            {isLogin ? "Create new user" : "Login"}
          </Link>
          <button>{isLoading ? "Saving" : "Save"}</button>
        </div>
      </form>
    </>
  );
}

export default AuthForm;
