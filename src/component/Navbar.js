import { Form, NavLink, useRouteLoaderData } from "react-router-dom";
import classes from "./Navbar.module.css";
import { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const token = useRouteLoaderData("root");

  const handleMenuToggle = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className={classes.navbar}>
      <div className={classes.navContainer}>
        <NavLink to="/blogList" className={classes.logo} onClick={closeMenu}>
          <span className={classes.logoIcon}>H</span>
          <span className={classes.logoText}>Harmedino</span>
        </NavLink>

        <button
          className={`${classes.hamburgerMenu} ${menuOpen ? classes.menuOpen : ""}`}
          onClick={handleMenuToggle}
          aria-label="Toggle menu"
        >
          <span className={classes.bar}></span>
          <span className={classes.bar}></span>
          <span className={classes.bar}></span>
        </button>

        {menuOpen && (
          <div className={classes.overlay} onClick={closeMenu}></div>
        )}

        <div className={`${classes.links} ${menuOpen ? classes.showBar : ""}`}>
          <ul className={classes.list}>
            <li>
              <NavLink
                to="/blogList"
                className={({ isActive }) => isActive ? classes.active : undefined}
                onClick={closeMenu}
              >
                Home
              </NavLink>
            </li>
            {token && (
              <>
                <li>
                  <NavLink
                    to="/"
                    className={({ isActive }) => isActive ? classes.active : undefined}
                    onClick={closeMenu}
                  >
                    Write
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/profile"
                    className={({ isActive }) => isActive ? classes.active : undefined}
                    onClick={closeMenu}
                  >
                    Profile
                  </NavLink>
                </li>
              </>
            )}
            <li>
              <NavLink
                to="/about-us"
                className={({ isActive }) => isActive ? classes.active : undefined}
                onClick={closeMenu}
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) => isActive ? classes.active : undefined}
                onClick={closeMenu}
              >
                Contact
              </NavLink>
            </li>
            {!token ? (
              <li>
                <NavLink to="/Auth?mode=login" className={classes.authBtn} onClick={closeMenu}>
                  Login
                </NavLink>
              </li>
            ) : (
              <li>
                <Form action="/logout" method="post">
                  <button className={classes.logoutBtn} onClick={closeMenu}>
                    Logout
                  </button>
                </Form>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
