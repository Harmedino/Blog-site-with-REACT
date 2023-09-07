import React, { useEffect } from "react";
import Navbar from "../component/Navbar";
import { Outlet, useLoaderData, useSubmit, useLocation } from "react-router-dom";
import Footer from "../component/Footer";

const RootPage = () => {
  const token = useLoaderData();
  const submit = useSubmit();
  const location = useLocation();

  useEffect(() => {
    if (!token) {
      return;
    }
    setTimeout(() => {
      submit(null, { action: "/logout", method: "post" });
    }, 2 * 60 * 60 * 2000);
  }, [token, submit]);

   const pathsWithoutFooter = ["/profile", '/profile/published','profile/approved','profile/disapproved']; 

   // Check if the current location pathname is in the pathsWithoutFooter array
   const shouldHideFooter = pathsWithoutFooter.includes(location.pathname);
 

  return (
    <div>
      <Navbar />
      <main >
        <Outlet></Outlet>
      </main>
      {!shouldHideFooter && <Footer />}
    </div>
  );
};

export default RootPage;
