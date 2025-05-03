import logo from "/logo-dark.png";
import "./HeaderHome.css";
import { Link } from "react-router-dom";

const HeaderHome = () => {
  return (
    <div className="header-container header-home">
      <img src={logo} alt="LeetClone" />
      {sessionStorage.getItem("accessToken") ? (
        <div>
          <span>
            <Link to="/sign-in">Log out</Link>
          </span>
        </div>
      ) : (
        <div>
          <span>
            <Link to="/sign-up">Register</Link>
          </span>{" "}
          or{" "}
          <span>
            <Link to="/sign-in">Sign in</Link>
          </span>
        </div>
      )}
    </div>
  );
};

export default HeaderHome;
