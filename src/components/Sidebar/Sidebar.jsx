import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";

import "./Sidebar.css";
import apiUrl from "../../config/api";

const Sidebar = ({ toggleSidebar, selectedProblemIndex, newResultId }) => {
    const [problems, setProblems] = useState([]);
    const [page, setPage] = useState(1);
    const [maxPage, setMaxPage] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        const token = sessionStorage.getItem("accessToken");
        fetch(`${apiUrl}/v1/problems?page=${page}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setMaxPage(data.maxPage);
                if (page === 1) setProblems(data.data);
                else setProblems((prev) => [...prev, ...data.data]);
            })
            .catch((error) => {
                console.error("Sidebar api error: ", error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [newResultId, page]);

    useEffect(() => {
        const size = problems.length;

        if (size > 0) {
            const currProblemIndex =
                ((selectedProblemIndex % size) + size) % size;
            navigate(
                `/problem/${problems[currProblemIndex]._id}/${currProblemIndex}`
            );
        }
    }, [selectedProblemIndex, problems]);

    const handleScroll = useCallback(
        debounce(() => {
            if (page < maxPage && !isLoading) {
                const scrollTop = window.scrollY;
                const windowHeight = window.innerHeight;
                const documentHeight = document.documentElement.scrollHeight;

                if (scrollTop + windowHeight >= documentHeight - 500) {
                    setPage((prev) => prev + 1);
                }
            }
        }, 500),
        [page, maxPage]
    );

    return (
        <div className="container-sidebar">
            <div className="header-sidebar">
                <span>List Of Problems</span>
                <button onClick={toggleSidebar}>
                    <i className="fa-solid fa-xmark" />
                </button>
            </div>

            {/* <div className="mobile-footer">
                <Footer page={page} setPage={setPage} maxPage={maxPage} />
            </div> */}

            <div className="problems scrollable" onScroll={handleScroll}>
                {problems?.map((problem, index) => {
                    return (
                        <div
                            key={index}
                            className={`problem-card ${
                                selectedProblemIndex === index ? "selected" : ""
                            }`}
                            onClick={() => {
                                navigate(`/problem/${problem._id}/${index}`);
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
                                className={`small-tag ${
                                    problem.difficulty === "EASY"
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
                {isLoading && <p className="loading-results">Loading...</p>}
            </div>
            {/* <div className="desktop-footer">
                <Footer page={page} setPage={setPage} maxPage={maxPage} />
            </div> */}
        </div>
    );
};

export default Sidebar;
