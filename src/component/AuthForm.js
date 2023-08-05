import { Link, useSearchParams } from "react-router-dom";

import classes from "./AuthForm.module.css";

function AuthForm() {
  const [searchParams] = useSearchParams();
  const isLogin = searchParams.get("mode") === "login";

  return (
    <>
      <form method="post" className={classes.form}>
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
