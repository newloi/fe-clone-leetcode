import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import "./Solutions.css";
import apiUrl from "../../config/api";
import Footer from "../Footer/Footer";
import nullImg from "../../assets/null.png";

const Solutions = ({ problemId, setTabSolution, setSolutionId }) => {
    const [solutions, setSolutions] = useState([]);
    const [page, setPage] = useState(1);
    const [maxPage, setMaxPage] = useState();

    useEffect(() => {
        fetch(`${apiUrl}/v1/problems/${problemId}/solutions?page=${page}`)
            .then((res) => res.json())
            .then((data) => {
                setSolutions(data.data);
                setMaxPage(data.maxPage);
            })
            .catch((error) => {
                console.error("get solutions error: ", error);
            });
    }, [page]);

    return (
        <div className="solutions-container">
            {/* <div className="seacrh-group"></div> */}
            {solutions.length !== 0 ? (
                <>
                    <div className="mobile-footer">
                        <Footer
                            page={page}
                            setPage={setPage}
                            maxPage={maxPage}
                        />
                    </div>
                    <div className="body-solutions scrollable">
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
                                            {solution.author?.name ||
                                                "Anonymous"}{" "}
                                            •{"  "}
                                            {solution.isClosed
                                                ? "Closed"
                                                : "Open"}{" "}
                                            • {updatedAt}
                                        </span>
                                        <span className="title-solutions">
                                            {solution.title}
                                        </span>
                                        <div className="tags">
                                            {solution.solution?.language && (
                                                <span>
                                                    {solution.solution
                                                        ?.language ===
                                                    "javascript"
                                                        ? "JavaScript"
                                                        : solution.solution
                                                              ?.language ===
                                                          "python"
                                                        ? "Python"
                                                        : solution.solution
                                                              ?.language ===
                                                          "cpp"
                                                        ? "C++"
                                                        : "Java"}
                                                </span>
                                            )}
                                            {solution.tags.map((tag, index) => {
                                                return (
                                                    <span key={index}>
                                                        {tag}
                                                    </span>
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
                    </div>
                    <div
                        style={{ marginBottom: "30px" }}
                        className="desktop-footer"
                    >
                        <Footer
                            page={page}
                            setPage={setPage}
                            maxPage={maxPage}
                        />
                    </div>
                </>
            ) : (
                <img src={nullImg} alt="No data" className="null-img" />
            )}
        </div>
    );
};

export default Solutions;
