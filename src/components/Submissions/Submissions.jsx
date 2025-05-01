import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import "./Submissions.css";
import apiUrl from "../../config/api";

function Submissions({ problemId, setResultId, setTabResult }) {
    const [submissions, setSubmissions] = useState();

    useEffect(() => {
        fetch(`${apiUrl}/v1/submissions?problemId=${problemId}`, {
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
                setSubmissions(data.data);
                console.log("submissions: ", data);
            })
            .catch((error) => {
                console.error("submissions error: ", error);
            });
    }, [problemId]);

    const handleSelectResult = (id) => {
        setResultId(id);
    };

    return (
        <div className="submissions-container">
            <div className="header-submissions">
                <span className="status-submissions">Status</span>
                <span className="language-submissions">Language</span>
                <span className="runtime-submissions">Runtime</span>
                <span className="createdAt-submissions">Submitted At</span>
            </div>
            <div className="body-submissions scrollable">
                {submissions?.map((submission, index) => {
                    const createdAt = formatDistanceToNow(
                        new Date(submission.createdAt),
                        { addSuffix: true }
                    );
                    const status = submission.status;

                    return (
                        <div
                            className={`submission-card ${
                                index % 2 === 1 ? "light-background" : ""
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
                                    {submission.language === "javascript"
                                        ? "JavaScript"
                                        : submission.language === "python"
                                        ? "Python"
                                        : submission.language === "cpp"
                                        ? "C++"
                                        : "Java"}
                                </span>
                            </span>
                            <span className="runtime-submissions">
                                <i className="fa-regular fa-clock"></i>{" "}
                                {Math.round(submission.runtime)} ms
                            </span>
                            <span className="createdAt-submissions">
                                {createdAt}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Submissions;
