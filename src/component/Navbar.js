import { NavLink, useNavigate } from "react-router-dom";
import classes from "./Navbar.module.css";
import { useEffect, useState } from "react";
import axios from "axios";

const Navbar = () => {
  const [data, setData] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    activeUser();
  }, []);

  async function activeUser() {
    let token = localStorage.getItem("authToken");

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
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        // Handle errors here
        console.log(error);
      }
    }
  }

  return (
    <nav className="navbar">
      <h1>HarmedinoBlog</h1>
      <div className="links">
        <nav>
          <ul className={classes.list}>
            <li>
              <NavLink
                to="/blogList"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
                end
              >
                Create new blog
              </NavLink>
            </li>
            {!data ? (
              <li>
                <NavLink
                  to="Auth?mode=login"
                  className={({ isActive }) =>
                    isActive ? classes.active : undefined
                  }
                >
                  Auth
                </NavLink>
              </li>
            ) : (
              <li>
                <NavLink
                  to="/logout"
                  className={({ isActive }) =>
                    isActive ? classes.active : undefined
                  }
                >
                  <button>logout</button>
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </nav>
  );
};

export default Navbar;
