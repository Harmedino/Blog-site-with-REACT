import { NavLink } from "react-router-dom";
import classes from "./Navbar.module.css";

const Navbar = () => {
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
                to="/Auth"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                Auth
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </nav>
  );
};

export default Navbar;
