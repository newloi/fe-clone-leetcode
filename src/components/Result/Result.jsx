import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import "highlight.js/styles/vs2015.css";
import refreshAccessToken from "../../api/refreshAccessToken";
import "./Result.css";
import apiUrl from "../../config/api";

const Result = ({ resultId }) => {
    const [result, setResult] = useState();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const getResult = async () => {
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
    const codeMarkdown = `\`\`\`${result?.language}
${result?.code}
\`\`\``;

    return (
        <div className="code-editor-container scrollable">
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
                    <span>submitted at {`${dateString} ${timeString}`}</span>
                </div>
                {status === "ACCEPTED" && (
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
                            <i className="fa-solid fa-pen-to-square" /> Solution
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
        </div>
    );
};

export default Result;
