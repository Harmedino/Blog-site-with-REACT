import "./App.css";
import Footer from "./component/Footer";
import Navbar from "./component/Navbar";
import Routing from "./component/Routing";
import {
  BrowserRouter as Router,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useContext, useEffect } from "react";
import ResponseDataContext from "./store/contex";

function App() {
  const { message } = useContext(ResponseDataContext);
  const location = useLocation();
  const navigate = useNavigate();
  const startsWithAny = (pathList) =>
    pathList.some((path) => location.pathname.startsWith(path));

  useEffect(() => {
    console.log("Message has changed:", message);
    if (!message) {
      navigate("/auth");
    }
  }, [message, navigate]);

  return (
    <div className="body">
      <Navbar message={message} />
      <div className="space">
        <Routing />
      </div>
      {!startsWithAny(["/profile", "/auth"]) && <Footer />}
    </div>
  );
}

export default App;
