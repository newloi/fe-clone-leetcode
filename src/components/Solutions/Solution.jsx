import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import "highlight.js/styles/vs2015.css";
import { useEffect, useState } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

import apiUrl from "@/config/api";
import refreshAccessToken from "@/api/refreshAccessToken";
import Dialog from "../Dialog/Dialog";

const Solution = ({ solutionId, setTab, isMySolution, setCount }) => {
    const [solution, setSolution] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [isShowWarning, setIsShowWarning] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setIsLoading(true);
        fetch(`${apiUrl}/v1/discussions/${solutionId}`, {
            headers: {
                "Cache-Control": "no-cache",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setSolution(data);
            })
            .catch((error) => {
                console.error("solution error: ", error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [solutionId]);

    const date = new Date(solution?.createdAt);
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

    const handleDeleteSolution = async (solutionId) => {
        setIsLoading(true);
        const deleteRequest = async (token) => {
            return await fetch(`${apiUrl}/v1/discussions/${solutionId}`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "Cache-Control": "no-cache",
                    "X-CSRF-Token": sessionStorage.getItem("csrfToken"),
                },
            });
        };

        try {
            let accessToken = sessionStorage.getItem("accessToken");
            if (accessToken) {
                let res = await deleteRequest(accessToken);

                if (res.status === 401) {
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
                    res = await deleteRequest(accessToken);
                }

                if (res.status === 204) {
                    setCount((pre) => pre + 1);
                    setTab("solutions");
                    toast.success("You’ve successfully deleted the solution.", {
                        autoClose: 3000,
                    });
                } else {
                    toast.error("Unexpected error. Please try again.", {
                        autoClose: 3000,
                    });
                }
            } else
                toast.error(
                    "Access denied. You are not authorized to perform this operation.",
                    {
                        autoClose: 3000,
                    }
                );
        } catch (error) {
            console.error("delete solution error: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {isShowWarning && (
                <Dialog
                    message={`Delete problem "${solution.title}"?`}
                    positiveBtnMessage="Delete"
                    negativeBtnMessage="No"
                    setIsShowDialog={setIsShowWarning}
                    action={() => {
                        handleDeleteSolution(solution._id);
                        setIsShowWarning(false);
                    }}
                />
            )}
            <div className="solution-container">
                <div className={`page-loader ${isLoading ? "" : "hidden"}`}>
                    <PulseLoader
                        color="#ffffff99"
                        loading={isLoading}
                        size={10}
                    />
                </div>
                <div className="header-solution">
                    <span
                        onClick={() => {
                            setTab("solutions");
                        }}
                    >
                        <i className="fa-solid fa-arrow-left" /> All Solutions
                    </span>
                </div>
                <div className="body-solution scrollable">
                    <p className="title-solution">{solution?.title}</p>
                    <div className="author-infor">
                        {solution?.author?.avatar ? (
                            <div className="avatar-frame">
                                <img src={solution?.author?.avatar} />
                            </div>
                        ) : (
                            <i className="fa-regular fa-circle-user" />
                        )}
                        <div>
                            <span>{solution?.author?.name}</span>
                            <span>
                                {dateString}, {timeString}
                            </span>
                        </div>
                        {isMySolution && (
                            <div className="edit-my-solution">
                                <button
                                    onClick={() => {
                                        setIsShowWarning(true);
                                    }}
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => {
                                        sessionStorage.setItem(
                                            "lastVisit",
                                            location.pathname
                                        );
                                        navigate(
                                            `/post-solution/result/solution/${solutionId}`
                                        );
                                    }}
                                >
                                    Edit
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="tags">
                        {solution?.tags?.map((tag, index) => {
                            return <span key={index}>{tag}</span>;
                        })}
                    </div>
                    <div className="content-solution">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw, rehypeHighlight]}
                        >
                            {solution?.content}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Solution;
