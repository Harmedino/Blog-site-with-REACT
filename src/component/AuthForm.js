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
    const { name, value } = e.target;
    setUserData({ ...userdata, [name]: value });
  }

  const handleResetPassword = () => {
    setUserData((prev) => ({ ...prev, password: "" }));
  };

  const config = { headers: { "Content-Type": "application/json" } };

  async function handleClick(event) {
    event.preventDefault();
    setIsLoading(true);
    axios.defaults.withCredentials = true;

    try {
      if (mode === "signup") {
        try {
          const { data } = await publicReq.post("/register", JSON.stringify(userdata), config);
          setMessage(data.message);
          setTimeout(() => navigate("/Auth?mode=login"), 3000);
        } catch (error) {
          setMessage(error.response.data.message);
          setTimeout(() => setMessage(""), 3000);
        }
      } else if (mode === "login") {
        const response = await publicReq.post("/login", JSON.stringify(userdata), config);
        if (response) {
          localStorage.setItem("token", response.data.token);
          setMessage(response.data.message);
          setTimeout(() => {
            navigate("/blogList");
            setMessage("");
          }, 2000);
        }
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
        setTimeout(() => setMessage(""), 3000);
      }
    }

    setIsLoading(false);
    handleResetPassword();
  }

  return (
    <div className={classes.authPage}>
      {message && <Message message={message} />}
      <div className={classes.authCard}>
        <div className={classes.authHeader}>
          <div className={classes.authLogo}>H</div>
          <h1>{isLogin ? "Welcome back" : "Create your account"}</h1>
          <p>{isLogin ? "Sign in to start writing and reading." : "Join thousands of writers and readers."}</p>
        </div>

        <div className={classes.modeTabs}>
          <Link
            to="?mode=login"
            className={`${classes.modeTab} ${isLogin ? classes.modeTabActive : ""}`}
          >
            Login
          </Link>
          <Link
            to="?mode=signup"
            className={`${classes.modeTab} ${!isLogin ? classes.modeTabActive : ""}`}
          >
            Sign Up
          </Link>
        </div>

        <form method="post" className={classes.form} onSubmit={handleClick}>
          {!isLogin && (
            <div className={classes.formRow}>
              <div className={classes.formGroup}>
                <label htmlFor="firstname">First Name</label>
                <input
                  id="firstname"
                  type="text"
                  name="firstname"
                  required
                  value={userdata.firstname}
                  placeholder="First name"
                  onChange={handleChange}
                />
              </div>
              <div className={classes.formGroup}>
                <label htmlFor="lastname">Last Name</label>
                <input
                  id="lastname"
                  type="text"
                  name="lastname"
                  required
                  value={userdata.lastname}
                  placeholder="Last name"
                  onChange={handleChange}
                />
              </div>
            </div>
          )}
          {!isLogin && (
            <div className={classes.formGroup}>
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                name="username"
                required
                value={userdata.username}
                placeholder="Choose a username"
                onChange={handleChange}
              />
            </div>
          )}
          <div className={classes.formGroup}>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              onChange={handleChange}
            />
          </div>
          <div className={classes.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              required
              value={userdata.password}
              placeholder="Enter your password"
              onChange={handleChange}
            />
          </div>

          <button type="submit" className={classes.submitBtn} disabled={isLoading}>
            {isLoading ? (
              <><span className={classes.btnSpinner}></span> {isLogin ? "Signing in..." : "Creating account..."}</>
            ) : (
              isLogin ? "Sign In →" : "Create Account →"
            )}
          </button>
        </form>

        <p className={classes.switchText}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <Link to={`?mode=${isLogin ? "signup" : "login"}`} onClick={handleResetPassword}>
            {isLogin ? "Sign up" : "Sign in"}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default AuthForm;
