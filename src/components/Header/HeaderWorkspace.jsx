import "./HeaderWorkspace.css";
import logo from "/logo-dark.png";

function HeaderWorkspace({ toggleSidebar }) {
    return (
        <div className="header-container">
            <div className="group-left-header">
                {/* <img src={logo} alt="logo" className="avatar" /> */}
                <button
                    className="no-background-btn action-btn"
                    onClick={toggleSidebar}
                >
                    <i className="fa-solid fa-bars big-icon" />
                </button>
                <button className="no-background-btn action-btn">
                    <i className="fa-solid fa-chevron-left header-icon" />
                </button>
                <button className="no-background-btn action-btn">
                    <i className="fa-solid fa-chevron-right header-icon" />
                </button>
            </div>
            <div className="group-middle-btn">
                <button className="action-btn middle-btn run-header-btn">
                    <i className="fa-solid fa-play middle-icon" /> Run
                </button>
                <button className="action-btn middle-btn green-icon">
                    <i className="fa-solid fa-cloud-arrow-up middle-icon" />{" "}
                    Submit
                </button>
            </div>
            <div className="group-right-header">
                <button className="action-btn no-background-btn">
                    <i className="fa-solid fa-gear big-icon" />
                </button>
                <img src={logo} alt="Avatar" className="avatar" />
            </div>
        </div>
    );
}

export default HeaderWorkspace;
