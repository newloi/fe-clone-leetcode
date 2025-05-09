import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import "./Submissions.css";
import apiUrl from "../../config/api";
import nullImg from "../../assets/null.png";
import { useNavigate } from "react-router-dom";
import refreshAccessToken from "../../api/refreshAccessToken";
import Footer from "../Footer/Footer";

const Submissions = ({ problemId, setResultId, setTabResult, newResultId }) => {
    const [submissions, setSubmissions] = useState([]);
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [maxPage, setMaxPage] = useState();

    useEffect(() => {
        const getSubmissions = async () => {
            const sendRequest = async (token) => {
                return await fetch(
                    `${apiUrl}/v1/submissions?problemId=${problemId}&page=${page}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
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
                setSubmissions(data.data);
                setMaxPage(data.maxPage);
            } catch (error) {
                console.error("submissions error: ", error);
            }
        };

        if (problemId) getSubmissions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newResultId, page]);

    const handleSelectResult = (id) => {
        setResultId(id);
    };

    return (
        <div className="submissions-container">
            {submissions?.length !== 0 ? (
                <>
                    <div className="header-submissions">
                        <span className="status-submissions">Status</span>
                        <span className="language-submissions">Language</span>
                        <span className="runtime-submissions">Runtime</span>
                        <span className="createdAt-submissions">
                            Submitted At
                        </span>
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
                        {/* <Footer page={page} setPage={setPage} maxPage={maxPage} /> */}
                    </div>
                    <div style={{ marginBottom: "30px" }}>
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

export default Submissions;
