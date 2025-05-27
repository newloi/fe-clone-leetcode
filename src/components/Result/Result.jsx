import { useEffect, useState, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import "highlight.js/styles/vs2015.css";
import PulseLoader from "react-spinners/PulseLoader";
import { jwtDecode } from "jwt-decode";

import refreshAccessToken from "../../api/refreshAccessToken";
import "./Result.css";
import apiUrl from "../../config/api";

const Result = ({ resultId, setResultId }) => {
    const [result, setResult] = useState(null);
    const [ranking, setRanking] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const resultRef = useRef(null);

    useEffect(() => {
        resultRef.current?.scrollTo({
            behavior: "smooth",
            top: 0,
        });
    }, [resultId]);

    useEffect(() => {
        const getResult = async () => {
            setIsLoading(true);
            const sendRequest = async (token) => {
                return await fetch(`${apiUrl}/v1/submissions/${resultId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
            };

            try {
                let accessToken = sessionStorage.getItem("accessToken");
                let res = await sendRequest(accessToken);

                if (res.status === 401) {
                    const refreshed = await refreshAccessToken();
                    if (!refreshed) {
                        toast.error(
                            "Your session has expired. Please log in again.",
                            { autoClose: 3000 }
                        );
                        sessionStorage.setItem("lastVisit", location.pathname);
                        navigate("/sign-in");
                        return;
                    }

                    accessToken = sessionStorage.getItem("accessToken");
                    res = await sendRequest(accessToken);
                }

                const data = await res.json();
                setResult(data);
            } catch (error) {
                console.error("get result error: ", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (resultId) {
            getResult();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resultId]);

    const date = new Date(result?.createdAt);
    const dateString = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit",
    });

    const timeString = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    const status = result?.status;

    useEffect(() => {
        const getRanking = async () => {
            setIsLoading(true);
            const sendRequest = async (token) => {
                return await fetch(
                    `${apiUrl}/v1/problems/${result?.problem}/leaderboards?limit=10&language=${result?.language}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            };

            try {
                let accessToken = sessionStorage.getItem("accessToken");
                let res = await sendRequest(accessToken);

                if (res.status === 401) {
                    const refreshed = await refreshAccessToken();
                    if (!refreshed) {
                        toast.error(
                            "Your session has expired. Please log in again.",
                            { autoClose: 3000 }
                        );
                        sessionStorage.setItem("lastVisit", location.pathname);
                        navigate("/sign-in");
                        return;
                    }

                    accessToken = sessionStorage.getItem("accessToken");
                    res = await sendRequest(accessToken);
                }

                const data = await res.json();
                setRanking(data);
            } catch (e) {
                console.error("Get ranking error: ", e);
            } finally {
                setIsLoading(false);
            }
        };

        if (status === "ACCEPTED") getRanking();
    }, [result]);

    useEffect(() => {
        const getProfile = async () => {
            setIsLoading(true);
            const sendRequest = async (token) => {
                return await fetch(`${apiUrl}/v1/users/${result.user}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Cache-Control": "no-cache",
                    },
                });
            };

            try {
                let accessToken = sessionStorage.getItem("accessToken");
                let res = await sendRequest(accessToken);

                if (res.status === 401) {
                    const refreshed = await refreshAccessToken();
                    if (!refreshed) {
                        toast.error(
                            "Your session has expired. Please log in again.",
                            { autoClose: 3000 }
                        );
                        sessionStorage.setItem("lastVisit", location.pathname);
                        navigate("/sign-in");
                        return;
                    }

                    accessToken = sessionStorage.getItem("accessToken");
                    res = await sendRequest(accessToken);
                }

                const data = await res.json();
                setUser(data);
            } catch (e) {
                console.error("Get ranking error: ", e);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            getProfile();
        }
    }, [result]);

    const codeMarkdown = `\`\`\`${result?.language}
${result?.code}
\`\`\``;

    return (
        <div ref={resultRef} className="code-editor-container scrollable">
            <div className={`page-loader ${isLoading ? "" : "hidden"}`}>
                <PulseLoader color="#ffffff99" loading={isLoading} size={10} />
            </div>

            <div className="header-result">
                <div className="status-result">
                    <p
                        className={
                            status === "ACCEPTED"
                                ? "accept-status"
                                : "error-status"
                        }
                    >
                        {status === "ACCEPTED"
                            ? "Accepted"
                            : status === "WRONG_ANSWER"
                            ? "Wrong Answer"
                            : "Compile Error"}
                    </p>
                    <span className="user-result">
                        {user?.avatar ? (
                            <div className="avatar-frame small-avatar">
                                <img src={user?.avatar} />
                            </div>
                        ) : (
                            <i className="fa-regular fa-circle-user medium-icon" />
                        )}{" "}
                        <span>{user?.name}</span> submitted at{" "}
                        {`${dateString} ${timeString}`}
                    </span>
                </div>
                {status === "ACCEPTED" &&
                    user?._id ===
                        jwtDecode(sessionStorage.getItem("accessToken"))
                            .sub && (
                        <button className="create-solution">
                            <Link
                                to={`/post-solution/${resultId}`}
                                onClick={() => {
                                    sessionStorage.setItem(
                                        "lastVisit",
                                        location.pathname
                                    );
                                }}
                            >
                                <i className="fa-solid fa-pen-to-square" />{" "}
                                Solution
                            </Link>
                        </button>
                    )}
            </div>
            {status === "ACCEPTED" ? (
                <div className="output-accept">
                    <p>
                        <i className="fa-regular fa-clock"></i> Runtime
                    </p>
                    <span>{Math.round(result?.runtime)}</span> ms
                </div>
            ) : (
                <div className="output-error">
                    <pre>{result?.error}</pre>
                </div>
            )}
            <div className="code-result">
                <div className="language">
                    Code <span>|</span>{" "}
                    {result?.language === "javascript"
                        ? "JavaScript"
                        : result?.language === "python"
                        ? "Python"
                        : result?.language === "cpp"
                        ? "C++"
                        : "Java"}
                </div>
                <div className="code-content">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw, rehypeHighlight]}
                    >
                        {codeMarkdown}
                    </ReactMarkdown>
                </div>
            </div>
            {status === "ACCEPTED" && (
                <div className="ranking-container">
                    <div className="ranking-title">
                        <i className="fa-solid fa-medal" /> Ranking
                    </div>
                    <div className="ranking">
                        {ranking?.map((rank, index) => (
                            <div
                                key={index}
                                className={`ranking-card ${
                                    index === 0
                                        ? "gold-medal"
                                        : index === 1
                                        ? "silver-medal"
                                        : index === 2
                                        ? "bronze-medal"
                                        : "normal"
                                }`}
                                onClick={() => {
                                    setResultId(rank?._id);
                                }}
                            >
                                {index < 3 ? (
                                    <i
                                        className={`fa-solid fa-medal ${
                                            index === 0
                                                ? "gold-medal"
                                                : index === 1
                                                ? "silver-medal"
                                                : index === 2
                                                ? "bronze-medal"
                                                : "normal"
                                        }`}
                                    />
                                ) : (
                                    <span className="rank-pos">
                                        {index + 1}
                                    </span>
                                )}
                                <div className="user-infor user-ranking">
                                    {rank?.user.avatar ? (
                                        <div className="avatar-frame medium-avatar">
                                            <img src={rank?.user.avatar} />
                                        </div>
                                    ) : (
                                        <i className="fa-regular fa-circle-user big-icon" />
                                    )}
                                    <span
                                        className={` ${
                                            index === 0
                                                ? "gold-medal"
                                                : index === 1
                                                ? "silver-medal"
                                                : index === 2
                                                ? "bronze-medal"
                                                : "normal"
                                        }`}
                                    >
                                        {rank?.user.name || "Username"}
                                    </span>
                                </div>
                                <span>{Math.round(rank?.runtime)}</span> ms
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {/* </>
            )} */}
        </div>
    );
};

export default Result;
