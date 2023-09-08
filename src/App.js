import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootPage from "./Pages/RootPage";
import CreateBlog from "./component/CreateBlog";
import DisplayBlogs from "./component/DisplayBlogs";
import Fullblog from "./component/Fullblog";
import AuthForm from "./component/AuthForm";
import Contact from "./component/Contact";
import AboutUs from "./component/AboutUs";
import Profile from "./component/profile/Profile";
import Profilepage from "./component/profile/Profilepage";
import Published from "./component/profile/Published";
import Approved from "./component/profile/Approved";
import Disapproved from "./component/profile/Disapproved";
import { action as LogoutAction } from "./component/Logout";
import { checkAuthLoader, loader as tokenLoader } from "./lib/token";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />,
    id: "root",
    loader: tokenLoader,
    children: [
      {
        path: "/blogList",
        children: [
          { index: true, element: <DisplayBlogs /> },
          { path: "more/:id", element: <Fullblog />, loader: checkAuthLoader },
        ],
      },
      { path: "/:id?", element: <CreateBlog />, loader: checkAuthLoader },

      { path: "/Auth", element: <AuthForm /> },
      { path: "/contact", element: <Contact /> },
      { path: "/about-us", element: <AboutUs /> },
      // {
      //   path: "/profile",
      //   element: <Profile />,
      //   loader: checkAuthLoader,
      //   children: [
      //     { index: true, element: <Profilepage /> },
      //     { path: "published", element: <Published /> },
      //     { path: "approved", element: <Approved /> },
      //     { path: "disapproved", element: <Disapproved /> },
      //   ],
      // },
      { path: "logout", action: LogoutAction },
      { path: "/more/:id", element: <Fullblog />, loader: checkAuthLoader },
    ],
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
