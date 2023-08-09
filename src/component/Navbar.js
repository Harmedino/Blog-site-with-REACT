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

  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

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
    <nav className={classes.navbar}>
      <div className={classes.navContainer}>
        <h1>Harmedino</h1>
        <div className={classes.hamburgerMenu} onClick={handleMenuToggle}>
          <i className={`fas fa-bars`}></i>
        </div>
        <div className={`${classes.links} ${menuOpen ? classes.showBar : ""}`}>
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
              >
                Create blog
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                Profile
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                Contact
              </NavLink>
            </li>
            {!data ? (
              <li>
                <NavLink
                  to="/Auth?mode=login"
                  className={({ isActive }) =>
                    isActive ? classes.active : undefined
                  }
                >
                  Auth
                </NavLink>
              </li>
            ) : (
              <>
                <li>
                  <NavLink
                    to="/logout"
                    className={({ isActive }) =>
                      isActive ? classes.active : undefined
                    }
                  >
                    Logout
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
