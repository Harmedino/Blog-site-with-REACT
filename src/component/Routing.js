import { useRoutes } from "react-router-dom";
import CreateBlog from "./CreateBlog";
import DisplayBlogs from "./DisplayBlogs";
import Fullblog from "./Fullblog";
import AuthForm from "./AuthForm";
import Contact from "./Contact";

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
  { path: "/logout" },
];

const Routing = () => {
  const routing = useRoutes(routes);

  return <div>{routing}</div>;
};

export default Routing;
