import { useEffect, useState } from "react";
import WorkSpace from "../../pages/WorkSpace/WorkSpace";
import "./Sidebar.css";

function Sidebar({ toggleSidebar, changeProblem }) {
    const [problems, setProblems] = useState([]);

    useEffect(() => {
        fetch("https://leetclone-be.onrender.com/v1/problems")
            .then((res) => res.json())
            .then((res) => {
                console.log("problems: ", res.data);
                setProblems(res.data);
            })
            .catch((error) => console.error("Sidebar api error: ", error));
    }, []);

    return (
        <div className="container-sidebar">
            <div className="header-sidebar">
                <span>List Of Problems</span>
                <button onClick={toggleSidebar}>
                    <i className="fa-solid fa-xmark" />
                </button>
            </div>
            <div className="problems scrollable">
                {problems?.map((problem, index) => {
                    return (
                        <div
                            key={index}
                            className="problem-card"
                            onClick={() => {
                                changeProblem(problem._id);
                                toggleSidebar();
                            }}
                        >
                            <i className="fa-regular fa-circle-check solved-icon" />
                            <div className="problem">
                                <p>{problem.title}</p>
                                <div className="tags">
                                    {problem.tags.map((tag, index) => {
                                        return <span key={index}>{tag}</span>;
                                    })}
                                </div>
                            </div>
                            <span
                                className={
                                    problem.difficulty === "EASY"
                                        ? "easy-tag"
                                        : problem.difficulty === "MEDIUM"
                                        ? "medium-tag"
                                        : "hard-tag"
                                }
                            >
                                {problem.difficulty}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Sidebar;
