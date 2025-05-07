import { Link } from "react-router-dom";
import { useState } from "react";

import logo from "/logo-dark.png";
import "./HeaderHome.css";
import UserBox from "../UserBox/UserBox";

const HeaderHome = () => {
    const [isCloseUserBox, setIsCloseUserBox] = useState(true);
    return (
        <div className="header-container header-home">
            <UserBox isClose={isCloseUserBox} setIsClose={setIsCloseUserBox} />
            <img src={logo} alt="LeetClone" />
            {sessionStorage.getItem("accessToken") ? (
                <div>
                    <span
                        onClick={() => {
                            setIsCloseUserBox((pre) => !pre);
                        }}
                    >
                        <i className="fa-regular fa-circle-user big-icon" />
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
