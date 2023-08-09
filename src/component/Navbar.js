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
        <div className={classes.menuIcon} onClick={handleMenuToggle}>
          <div className={classes.iconBar}></div>
          <div className={classes.iconBar}></div>
          <div className={classes.iconBar}></div>
        </div>
        <div className={`${classes.links} ${menuOpen ? classes.open : ""}`}>
          <ul className={classes.list}>
            <li>
              <NavLink
                to="/blogList"
                className={classes.link}
                activeClassName={classes.active}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/"
                className={classes.link}
                activeClassName={classes.active}
                end
              >
                Create new blog
              </NavLink>
            </li>
            <li>
                  <NavLink
                    to="/profile"
                    className={classes.link}
                    activeClassName={classes.active}
                  >
                    Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/about"
                    className={classes.link}
                    activeClassName={classes.active}
                  >
                    About Us
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/contact"
                    className={classes.link}
                    activeClassName={classes.active}
                  >
                    Contact
                  </NavLink>
                </li>
            {!data ? (
              <li>
                <NavLink
                  to="/Auth?mode=login"
                  className={classes.link}
                  activeClassName={classes.active}
                >
                  Auth
                </NavLink>
              </li>
            ) : (
              <>
               
                <li>
                  <NavLink
                    to="/logout"
                    className={classes.link}
                    activeClassName={classes.active}
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
