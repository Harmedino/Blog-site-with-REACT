import React, { useEffect } from "react";
import Navbar from "../component/Navbar";
import { Outlet, useLoaderData, useSubmit } from "react-router-dom";
import Footer from "../component/Footer";

const RootPage = () => {
  const token = useLoaderData();
  const submit = useSubmit();

  useEffect(() => {
    if (!token) {
      return;
    }
    setTimeout(() => {
      submit(null, { action: "/logout", method: "post" });
    }, 2 * 60 * 60 * 1000);
  }, [token, submit]);

  return (
    <div>
      <Navbar />
      <main className="space">
        <Outlet></Outlet>
      </main>

      <Footer />
    </div>
  );
};

export default RootPage;
