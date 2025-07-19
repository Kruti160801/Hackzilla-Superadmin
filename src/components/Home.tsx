import { useNavigate } from "react-router-dom";
import "./Home.css";
import Dashboard from "./Dashboard";

function Home() {
  const navigate = useNavigate();
  return (
    <div className="App">
      <Dashboard />
      {/* <button onClick={() => navigate("/login")} className="logout-button">
        Log out
      </button> */}
    </div>
  );
}

export default Home;
