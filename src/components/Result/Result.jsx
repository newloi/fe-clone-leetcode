import { useEffect, useState } from "react";
import "./Result.css";
import apiUrl from "../../config/api";

function Result({ resultId }) {
    const [result, setResult] = useState();

    useEffect(() => {
        fetch(`${apiUrl}/v1/submissions/${resultId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem(
                    "accessToken"
                )}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setResult(data);
                console.log(data);
            })
            .catch((error) => {
                console.error("get result erro: ", error);
            });
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
