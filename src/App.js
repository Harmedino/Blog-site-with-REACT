import "./App.css";
import Footer from "./component/Footer";
import Navbar from "./component/Navbar";
import Routing from "./component/Routing";
import { BrowserRouter as Router, useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  const startsWithAny = (pathList) =>
    pathList.some((path) => location.pathname.startsWith(path));

  return (
    <div className="body">
      <Navbar />
      <div className="space">
        <Routing />
      </div>
      {!startsWithAny(["/profile", "/Auth"]) && <Footer />}
    </div>
  );
}

export default App;
