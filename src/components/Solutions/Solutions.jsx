import { useEffect, useState, useCallback } from "react";
import { formatDistanceToNow } from "date-fns";
import debounce from "lodash.debounce";

import "./Solutions.css";
import apiUrl from "../../config/api";
import Footer from "../Footer/Footer";
import nullImg from "../../assets/null.png";

const Solutions = ({ problemId, setTabSolution, setSolutionId }) => {
    const [solutions, setSolutions] = useState([]);
    const [page, setPage] = useState(1);
    const [maxPage, setMaxPage] = useState();
    const [isLoading, setisLoading] = useState(false);

    useEffect(() => {
        setisLoading(true);
        fetch(`${apiUrl}/v1/problems/${problemId}/solutions?page=${page}`)
            .then((res) => res.json())
            .then((data) => {
                if (page === 1) setSolutions(data.data);
                else setSolutions((prev) => [...prev, ...data.data]);
                setMaxPage(data.maxPage);
            })
            .catch((error) => {
                console.error("get solutions error: ", error);
            })
            .finally(() => {
                setisLoading(false);
            });
    }, [page]);

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
        <div className="solutions-container">
            {/* <div className="seacrh-group"></div> */}
            {solutions.length !== 0 ? (
                <div
                    className="body-solutions scrollable"
                    onScroll={handleScroll}
                >
                    {solutions?.map((solution, index) => {
                        const updatedAt = formatDistanceToNow(
                            new Date(solution.updatedAt),
                            { addSuffix: true }
                        );
                        return (
                            <div
                                className="solution-card"
                                key={index}
                                onClick={() => {
                                    setSolutionId(solution._id);
                                    setTabSolution("solution");
                                }}
                            >
                                <div className="avatar">
                                    <i className="fa-regular fa-circle-user big-icon" />
                                </div>
                                <div className="body-card">
                                    <span className="infor">
                                        {solution.author?.name || "Anonymous"} •
                                        {"  "}
                                        {solution.isClosed
                                            ? "Closed"
                                            : "Open"}{" "}
                                        • {updatedAt}
                                    </span>
                                    <span className="title-solutions">
                                        {solution.title}
                                    </span>
                                    <div className="tags">
                                        {solution.tags.map((tag, index) => {
                                            return (
                                                <span key={index}>{tag}</span>
                                            );
                                        })}
                                    </div>
                                    <div className="reactions">
                                        <span>
                                            <i className="fa-regular fa-thumbs-up" />{" "}
                                            {solution.upvotes}
                                        </span>
                                        <span>
                                            <i className="fa-regular fa-thumbs-down" />{" "}
                                            {solution.downvotes}
                                        </span>
                                        <span>
                                            <i className="fa-regular fa-comment" />{" "}
                                            {solution.comments.length}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {isLoading && <p className="loading-results">Loading...</p>}
                </div>
            ) : (
                <img src={nullImg} alt="No data" className="null-img" />
            )}
        </div>
    );
};

export default Solutions;
