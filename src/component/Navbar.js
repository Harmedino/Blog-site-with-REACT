import { Form, NavLink, useNavigate } from "react-router-dom";
import classes from "./Navbar.module.css";
import { useEffect, useState } from "react";

const Navbar = ({ message }) => {
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
            {!message ? (
              <>
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
              </>
            ) : (
              " "
            )}
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

            <>
              <li>
                <Form action="/logout" method="post">
                  <button> Logout</button>
                </Form>
              </li>
            </>
          </ul>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
