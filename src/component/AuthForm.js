import { Link, useSearchParams } from "react-router-dom";

import classes from "./AuthForm.module.css";
import { useState } from "react";
import axios from "axios";

function AuthForm() {
  const [searchParams] = useSearchParams();
  const isLogin = searchParams.get("mode") === "login";
  const mode = searchParams.get("mode");

  const [data, setData] = useState();

  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    setData({ ...data, [name]: value });
  }

  const config = {
    headers: {
      "Content-Type": "application/json", // Set the appropriate content type
    },
  };

  function handleClick(event) {
    event.preventDefault();
    console.log(data, mode);

    if (mode === "signup") {
      try {
        const response = axios.post(
          "http://localhost:5000/auth/register",
          JSON.stringify(data),
          config
        );
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <>
      <form method="post" className={classes.form} onSubmit={handleClick}>
        <h1>{isLogin ? "Log in" : "Create a new user"}</h1>

        {!isLogin && (
          <>
            <p>
              <label htmlFor="fullname">Full Name:</label>
              <input
                id="name:"
                type="text"
                name="name"
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
          <button>Save</button>
        </div>
      </form>
    </>
  );
}

export default AuthForm;
