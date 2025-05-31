import { useEffect, useState, useCallback } from "react";
import { formatDistanceToNow } from "date-fns";
import debounce from "lodash.debounce";
import PulseLoader from "react-spinners/PulseLoader";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import "./Solutions.css";
import apiUrl from "../../config/api";
import Footer from "../Footer/Footer";
import nullImg from "../../assets/null.png";
import refreshAccessToken from "@/api/refreshAccessToken";
import Dialog from "../Dialog/Dialog";

const Solutions = ({
    problemId,
    setTabSolution,
    setSolutionId,
    setIsMySolution,
    count,
    setCount,
}) => {
    const [solutions, setSolutions] = useState([]);
    const [page, setPage] = useState(1);
    const [maxPage, setMaxPage] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [isShowAll, setIsShowAll] = useState(true);
    const [solutionSelected, setSolutionSelected] = useState(null);
    const [isShowWarning, setIsShowWarning] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setPage(1);
    }, [isShowAll, count]);

    const fetchAllSolutions = async () => {
        setIsLoading(true);
        return await fetch(
            `${apiUrl}/v1/problems/${problemId}/solutions?page=${page}`
        )
            .then((res) => res.json())
            .then((data) => {
                if (page === 1) setSolutions(data.data);
                else setSolutions((prev) => [...prev, ...data.data]);
                setMaxPage(data.maxPage);
            })
            .catch((e) => {
                console.error("get all solutions error: ", e);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const fetchMySolutions = async () => {
        const sendRequest = async (token) => {
            setIsLoading(true);
            return await fetch(
                `${apiUrl}/v1/users/discussions?problemId=${problemId}&page=${page}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Cache-Control": "no-cache",
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
            if (page === 1) setSolutions(data.data);
            else setSolutions((prev) => [...prev, ...data.data]);
            setMaxPage(data.maxPage);
        } catch (e) {
            console.error("get my solutions error: ", e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isShowAll) {
            fetchAllSolutions();
        } else {
            fetchMySolutions();
        }
    }, [page, count]);

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
                    message={`Delete problem "${solutionSelected.title}"?`}
                    positiveBtnMessage="Delete"
                    negativeBtnMessage="No"
                    setIsShowDialog={setIsShowWarning}
                    action={() => {
                        handleDeleteSolution(solutionSelected._id);
                        setIsShowWarning(false);
                    }}
                />
            )}
            <div className="solutions-container">
                {sessionStorage.getItem("accessToken") && (
                    <span className="search-group">
                        {isShowAll ? (
                            <button
                                onClick={() => {
                                    setIsShowAll(false);
                                    fetchMySolutions();
                                }}
                            >
                                My solutions
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    setIsShowAll(true);
                                    fetchAllSolutions();
                                }}
                            >
                                All solutions
                            </button>
                        )}
                    </span>
                )}
                {solutions?.length !== 0 ? (
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
                                        setIsMySolution(!isShowAll);
                                        setSolutionId(solution._id);
                                        setTabSolution("solution");
                                    }}
                                >
                                    <div className="avatar">
                                        {solution?.author?.avatar ? (
                                            <div className="avatar-frame small-avatar">
                                                <img
                                                    src={
                                                        solution?.author?.avatar
                                                    }
                                                />
                                            </div>
                                        ) : (
                                            <i className="fa-regular fa-circle-user big-icon" />
                                        )}
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
                                    {!isShowAll && (
                                        <i
                                            className="fa-solid fa-trash delete-icon"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSolutionSelected(solution);
                                                setIsShowWarning(true);
                                            }}
                                        />
                                    )}
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
                ) : (
                    <img src={nullImg} alt="No data" className="null-img" />
                )}
            </div>
        </>
    );
};

export default Solutions;
