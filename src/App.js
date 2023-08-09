import "./App.css";
import Message from "./UI/Message";
import Navbar from "./component/Navbar";
import Routing from "./component/Routing";

function App() {
  return (
    <div className="body">
      <Navbar />
      <div className="space">
        <Routing></Routing>
      </div>
    </div>
  );
}

export default App;
