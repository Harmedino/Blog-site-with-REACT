import React from "react";
import Navbar from "../component/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "../component/Footer";

const RootPage = () => {
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
