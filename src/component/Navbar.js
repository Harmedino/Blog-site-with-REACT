import { NavLink } from "react-router-dom";
import classes from "./Navbar.module.css";
import { useEffect, useState } from "react";
import axios from "axios";

const Navbar = () => {
  const [data, setData] = useState();
  useEffect(() => {
    activeUser();
  }, []);

  async function activeUser() {
    let token = localStorage.getItem("authToken");
    console.log(token);
    if (token) {
      try {
        const response = await axios.post(
          "http://localhost:5000/verifyToken",
          {}, 
          {
            headers: {
              Authorization: `Bearer ${token}`, // Correct header format
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
            <li>
              <NavLink
                to="Auth?mode=login"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                Logout
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </nav>
  );
};

export default Navbar;
