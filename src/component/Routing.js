import { useRoutes } from "react-router-dom";
import CreateBlog from "./CreateBlog";
import DisplayBlogs from "./DisplayBlogs";
import Fullblog from "./Fullblog";
import AuthForm from "./AuthForm";
import Contact from "./Contact";
import AboutUs from "./AboutUs";
import Profile from "./profile/Profile";
import Profilepage from "./profile/Profilepage";

const routes = [
  { path: "/:id?", element: <CreateBlog /> },
  {
    path: "/blogList",
    children: [
      { index: true, element: <DisplayBlogs /> },
      { path: "more/:id", element: <Fullblog /> },
    ],
  },
  { path: "/Auth", element: <AuthForm /> },
  { path: "/contact", element: <Contact /> },
  { path: "/about-us", element: <AboutUs /> },
  {
    path: "/profile",
    element: <Profile />,
    children: [{ index: true, element: <Profilepage /> }],
  },
  { path: "/logout" },
];

const Routing = () => {
  const routing = useRoutes(routes);

  return <div>{routing}</div>;
};

export default Routing;
