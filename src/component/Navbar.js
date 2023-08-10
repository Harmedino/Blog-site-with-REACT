import { NavLink, useNavigate } from "react-router-dom";
import classes from "./Navbar.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { activeUser } from "../lib/token";

const Navbar = () => {
  const [data, setData] = useState();
  const navigate = useNavigate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const fetchData = async () => {
      const user = await activeUser();
      setData(user);
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);

  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className={classes.navbar}>
      <div className={classes.navContainer}>
        <h1>Harmedino</h1>
        <div className={classes.hamburgerMenu} onClick={handleMenuToggle}>
          <i className={`fas fa-bars`}></i>
        </div>
        <div className={`${classes.links} ${menuOpen ? classes.showBar : ""}`}>
          <ul className={classes.list} onClick={handleMenuToggle}>
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
                to="/about-us"
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
