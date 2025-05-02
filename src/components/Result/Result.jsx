import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import refreshAccessToken from "../../api/refreshAccessToken";
import "./Result.css";
import apiUrl from "../../config/api";

function Result({ resultId }) {
    const [result, setResult] = useState();
    const navigate = useNavigate();

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
                    console.warn("Token expired, attempting to refresh...");

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
                setResult(data);
                console.log(data);
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

    return (
        <div className="code-editor-container scrollable">
            <div className="status-result">
                <p
                    className={
                        status === "ACCEPTED" ? "accept-status" : "error-status"
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
                    <pre>
                        <code>{result?.code}</code>
                    </pre>
                </div>
            </div>
        </div>
    );
}

export default Result;
