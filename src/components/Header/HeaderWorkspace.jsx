import { useState } from "react";
import { Link } from "react-router-dom";

import "./HeaderWorkspace.css";
import UserBox from "../UserBox/UserBox";
// import logo from "/logo-dark.png";

const HeaderWorkspace = ({
    toggleSidebar,
    preProblem,
    nextProblem,
    handleSubmitCode,
}) => {
    const [isCloseUserBox, setIsCloseUserBox] = useState(true);

    return (
        <div className="header-container">
            <div className="group-left-header">
                {/* <img src={logo} alt="logo" className="avatar" /> */}
                <button
                    className="no-background-btn action-btn"
                    onClick={toggleSidebar}
                >
                    <i className="fa-solid fa-bars medium-icon" />
                </button>
                <button
                    className="no-background-btn action-btn"
                    onClick={preProblem}
                >
                    <i className="fa-solid fa-chevron-left header-icon" />
                </button>
                <button
                    className="no-background-btn action-btn"
                    onClick={nextProblem}
                >
                    <i className="fa-solid fa-chevron-right header-icon" />
                </button>
            </div>
            <div className="group-middle-btn">
                <button className="action-btn middle-btn run-header-btn">
                    <i className="fa-solid fa-play middle-icon" /> Run
                </button>
                <button
                    className="action-btn middle-btn green-icon"
                    onClick={handleSubmitCode}
                >
                    <i className="fa-solid fa-cloud-arrow-up middle-icon" />{" "}
                    Submit
                </button>
            </div>
            <div className="group-right-header">
                <button className="action-btn no-background-btn">
                    <i className="fa-solid fa-gear medium-icon" />
                </button>
                {sessionStorage.getItem("accessToken") ? (
                    <div>
                        <UserBox
                            isClose={isCloseUserBox}
                            setIsClose={setIsCloseUserBox}
                        />
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
        </div>
    );
};

export default HeaderWorkspace;
