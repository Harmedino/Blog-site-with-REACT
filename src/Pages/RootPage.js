import React, { useEffect } from "react";
import Navbar from "../component/Navbar";
import { Outlet, useLoaderData, useSubmit, useLocation } from "react-router-dom";
import Footer from "../component/Footer";

const RootPage = () => {
  const token = useLoaderData();
  const submit = useSubmit();
  const location = useLocation();

  useEffect(() => {
    if (!token) return;
    const timeout = setTimeout(() => {
      submit(null, { action: "/logout", method: "post" });
    }, 2 * 60 * 60 * 2000);
    return () => clearTimeout(timeout);
  }, [token, submit]);

  const pathsWithoutFooter = ["/profile", "/profile/published", "/profile/approved", "/profile/disapproved"];
  const shouldHideFooter = pathsWithoutFooter.some((p) => location.pathname.startsWith(p));

  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
      {!shouldHideFooter && <Footer />}
    </div>
  );
};

export default RootPage;
