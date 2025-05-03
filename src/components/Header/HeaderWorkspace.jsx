import "./HeaderWorkspace.css";
// import logo from "/logo-dark.png";

const HeaderWorkspace = ({
  toggleSidebar,
  preProblem,
  nextProblem,
  handleSubmitCode,
}) => {
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
        <i className="fa-regular fa-circle-user big-icon"></i>
      </div>
    </div>
  );
};

export default HeaderWorkspace;
