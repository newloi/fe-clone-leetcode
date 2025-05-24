import { useState, useEffect, useCallback } from "react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import debounce from "lodash.debounce";
import PulseLoader from "react-spinners/PulseLoader";

import "./Submissions.css";
import apiUrl from "../../config/api";
import nullImg from "../../assets/null.png";
import { useNavigate } from "react-router-dom";
import refreshAccessToken from "../../api/refreshAccessToken";

const Submissions = ({ problemId, setResultId, setTabResult, newResultId }) => {
    const [submissions, setSubmissions] = useState([]);
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setPage(1);
    }, [newResultId]);

    useEffect(() => {
        const getSubmissions = async () => {
            const sendRequest = async (token) => {
                setIsLoading(true);
                return await fetch(
                    `${apiUrl}/v1/submissions?problemId=${problemId}&page=${page}&limit=15`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Cache-Control": "no-cache",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            };

            try {
                let accessToken = sessionStorage.getItem("accessToken");
                let res = await sendRequest(accessToken);

                if (res.status === 401) {
                    console.warn("refresh token...");

                    const refreshed = await refreshAccessToken();
                    if (!refreshed) {
                        toast.error(
                            "Your session has expired. Please log in again.",
                            { autoClose: 3000 }
                        );
                        navigate("/sign-in");
                        return;
                    }

                    accessToken = sessionStorage.getItem("accessToken");
                    res = await sendRequest(accessToken);
                }
                const data = await res.json();
                if (page === 1) setSubmissions(data.data);
                else setSubmissions((prev) => [...prev, ...data.data]);
                setMaxPage(data.maxPage);
            } catch (error) {
                console.error("submissions error: ", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (problemId) getSubmissions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, newResultId]);

    const handleSelectResult = (id) => {
        setResultId(id);
    };

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
        <div className="submissions-container">
            {submissions && submissions.length > 0 ? (
                <>
                    <div className="header-submissions">
                        <span className="status-submissions">Status</span>
                        <span className="language-submissions">Language</span>
                        <span className="runtime-submissions">Runtime</span>
                        <span className="createdAt-submissions">
                            Submitted At
                        </span>
                    </div>

                    <div
                        className="body-submissions scrollable"
                        onScroll={handleScroll}
                    >
                        {submissions.map((submission, index) => {
                            const createdAt = formatDistanceToNow(
                                new Date(submission.createdAt),
                                { addSuffix: true }
                            );
                            const status = submission.status;

                            return (
                                <div
                                    className={`submission-card ${
                                        index % 2 === 1
                                            ? "light-background"
                                            : ""
                                    }`}
                                    key={index}
                                    onClick={() => {
                                        handleSelectResult(submission._id);
                                        setTabResult("result");
                                    }}
                                >
                                    <span className="index-submissions">
                                        {index + 1}
                                    </span>
                                    <span
                                        className={`status-submissions ${
                                            status === "ACCEPTED"
                                                ? "accept-status"
                                                : "error-status"
                                        }`}
                                    >
                                        {status === "WRONG_ANSWER"
                                            ? "Wrong Answer"
                                            : status === "COMPILE_ERROR"
                                            ? "Compile Error"
                                            : "Accepted"}
                                    </span>
                                    <span className="language-submissions">
                                        <span className="tag">
                                            {submission.language ===
                                            "javascript"
                                                ? "JavaScript"
                                                : submission.language ===
                                                  "python"
                                                ? "Python"
                                                : submission.language === "cpp"
                                                ? "C++"
                                                : "Java"}
                                        </span>
                                    </span>
                                    <span className="runtime-submissions">
                                        <i className="fa-regular fa-clock"></i>{" "}
                                        {status === "ACCEPTED"
                                            ? `${Math.round(
                                                  submission.runtime
                                              )} ms`
                                            : "N/A"}
                                    </span>
                                    <span className="createdAt-submissions">
                                        {createdAt}
                                    </span>
                                </div>
                            );
                        })}
                        <div className="scroll-loader">
                            <PulseLoader
                                color="#ffffff99"
                                loading={isLoading}
                                size={10}
                            />
                        </div>
                    </div>
                </>
            ) : (
                <img src={nullImg} alt="No data" className="null-img" />
            )}
        </div>
    );
};

export default Submissions;
