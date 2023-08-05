import { useRoutes } from "react-router-dom";
import CreateBlog from "./CreateBlog";
import DisplayBlogs from "./DisplayBlogs";
import Fullblog from "./Fullblog";
import AuthForm from "./AuthForm";

const routes = [
  { path: "/:id?", element: <CreateBlog /> },
  {
    path: "/blogList",
    children: [
      { index: true, element: <DisplayBlogs /> },
      { path: "more/:id", element: <Fullblog /> },
    ],
  },
  { path: "/auth", element: <AuthForm /> },
];

const Routing = () => {
  const routing = useRoutes(routes);

  return <div>{routing}</div>;
};

export default Routing;
