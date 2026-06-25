import { Form, NavLink, useRouteLoaderData } from "react-router-dom";
import classes from "./Navbar.module.css";
import { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const token = useRouteLoaderData("root");

  const handleMenuToggle = () => setMenuOpen((o) => !o);
  const closeMenu = () => setMenuOpen(false);

  const linkClass = ({ isActive }) =>
    isActive ? classes.active : undefined;

  return (
    <nav className={classes.navbar}>
      <div className={classes.navContainer}>
        {/* Logo */}
        <NavLink to="/blogList" className={classes.logo} onClick={closeMenu}>
          <span className={classes.logoIcon}>H</span>
          <span className={classes.logoText}>Harmedino</span>
        </NavLink>

        {/* Hamburger */}
        <button
          className={`${classes.hamburgerMenu} ${menuOpen ? classes.menuOpen : ""}`}
          onClick={handleMenuToggle}
          aria-label="Toggle menu"
        >
          <span className={classes.bar}></span>
          <span className={classes.bar}></span>
          <span className={classes.bar}></span>
        </button>

        {menuOpen && <div className={classes.overlay} onClick={closeMenu} />}

        {/* Nav links — shared desktop + mobile drawer */}
        <div className={`${classes.links} ${menuOpen ? classes.showBar : ""}`}>
          <ul className={classes.list}>
            <li>
              <NavLink to="/blogList" className={linkClass} onClick={closeMenu}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/blogs" className={linkClass} onClick={closeMenu}>
                Blog
              </NavLink>
            </li>
            <li>
              <NavLink to="/about-us" className={linkClass} onClick={closeMenu}>
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={linkClass} onClick={closeMenu}>
                Contact
              </NavLink>
            </li>
          </ul>

          {/* Mobile-only action buttons inside the drawer */}
          <div className={classes.mobileActions}>
            {token ? (
              <>
                <NavLink to="/" className={classes.writeBtn} onClick={closeMenu}>
                  <span className={classes.writeIcon}>✍</span> Write
                </NavLink>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `${classes.profileBtn} ${isActive ? classes.profileBtnActive : ""}`
                  }
                  onClick={closeMenu}
                >
                  Profile
                </NavLink>
                <Form action="/logout" method="post">
                  <button className={classes.logoutBtn} onClick={closeMenu}>
                    Log out
                  </button>
                </Form>
              </>
            ) : (
              <NavLink to="/Auth?mode=login" className={classes.authBtn} onClick={closeMenu}>
                Sign in
              </NavLink>
            )}
          </div>
        </div>

        {/* Desktop-only right-side actions */}
        <div className={classes.actions}>
          {token ? (
            <>
              <NavLink to="/" className={classes.writeBtn}>
                <span className={classes.writeIcon}>✍</span> Write
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `${classes.profileBtn} ${isActive ? classes.profileBtnActive : ""}`
                }
              >
                Profile
              </NavLink>
              <Form action="/logout" method="post">
                <button className={classes.logoutBtn}>Log out</button>
              </Form>
            </>
          ) : (
            <NavLink to="/Auth?mode=login" className={classes.authBtn}>
              Sign in
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
