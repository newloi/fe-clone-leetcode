import { useEffect, useState } from "react";
import "./Sidebar.css";
import apiUrl from "@/config/api";

function Sidebar({ toggleSidebar, changeProblem, selectedProblemIndex }) {
    const [problems, setProblems] = useState([]);

    useEffect(() => {
        fetch(`${apiUrl}/v1/problems`)
            .then((res) => res.json())
            .then((res) => {
                console.log("problems: ", res.data);
                setProblems(res.data);
            })
            .catch((error) => console.error("Sidebar api error: ", error));
    }, []);

    useEffect(() => {
        const size = problems.length;

        if (size > 0) {
            const currProblemId = ((selectedProblemIndex % size) + size) % size;
            changeProblem(problems[currProblemId]._id, currProblemId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedProblemIndex, problems]);

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
                            className={`problem-card ${selectedProblemIndex === index ? "selected" : ""
                                }`}
                            onClick={() => {
                                changeProblem(problem._id, index);
                                toggleSidebar();
                            }}
                        >
                            <i
                                className={
                                    problem.status === "SOLVED"
                                        ? "fa-regular fa-circle-check solved-icon"
                                        : problem.status === "ATTEMPTED"
                                            ? "fa-solid fa-circle-half-stroke attempted-icon"
                                            : "fa-regular fa-circle unsolved-icon"
                                }
                            />
                            <div className="problem">
                                <p>{problem.title}</p>
                                <div className="tags">
                                    {problem.tags.map((tag, index) => {
                                        return <span key={index}>{tag}</span>;
                                    })}
                                </div>
                            </div>
                            <span
                                className={`small-tag ${problem.difficulty === "EASY"
                                        ? "easy-tag"
                                        : problem.difficulty === "MEDIUM"
                                            ? "medium-tag"
                                            : "hard-tag"
                                    }`}
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
