import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  return (
    <div className="App">
      <button onClick={() => navigate("/login")} className="logout-button">
        Log out
      </button>
    </div>
  );
}

export default Home;
