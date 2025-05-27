import { Link } from "react-router-dom";
import { useState } from "react";

import logo from "/logo-dark.png";
import "./HeaderHome.css";
import UserBox from "../UserBox/UserBox";

const HeaderHome = () => {
    const [avatar, setAvatar] = useState(null);
    const [isCloseUserBox, setIsCloseUserBox] = useState(true);
    return (
        <div className="header-container header-home">
            <img src={logo} alt="LeetClone" />
            {sessionStorage.getItem("accessToken") ? (
                <div>
                    <UserBox
                        isClose={isCloseUserBox}
                        setIsClose={setIsCloseUserBox}
                        setAvatarHome={setAvatar}
                    />
                    <span
                        onClick={() => {
                            setIsCloseUserBox((pre) => !pre);
                        }}
                    >
                        {avatar ? (
                            <div
                                className="avatar-frame medium-avatar"
                                style={{
                                    width: 40,
                                    height: 40,
                                }}
                            >
                                <img src={avatar} />
                            </div>
                        ) : (
                            <i className="fa-regular fa-circle-user big-icon" />
                        )}
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
