import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import PulseLoader from "react-spinners/PulseLoader";

import "./AdminProblems.css";
import apiUrl from "@/config/api";
import Footer from "../Footer/Footer";
import Dialog from "../Dialog/Dialog";
import refreshAccessToken from "@/api/refreshAccessToken";

const AdminProblems = () => {
    const [problems, setProblems] = useState([]);
    const [page, setPage] = useState(1);
    const [maxPage, setMaxPage] = useState();
    const [isShowWarning, setIsShowWarning] = useState(false);
    const [problemSelected, setProblemSelected] = useState({});
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    // useEffect(() => {
    //     const token = sessionStorage.getItem("accessToken");
    //     fetch(`${apiUrl}/v1/problems?page=${page}&limit=20`, {
    //         method: "GET",
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Cache-Control": "no-cache",
    //             ...(token && { Authorization: `Bearer ${token}` }),
    //         },
    //     })
    //         .then((res) => res.json())
    //         .then((res) => {
    //             setMaxPage(res.maxPage);
    //             setProblems(res.data);
    //         })
    //         .catch((error) => console.error("problems api error: ", error));
    // }, [page, count]);

    const fetchProblems = async () => {
        setIsLoading(true);
        const sendRequest = async (token) => {
            return await fetch(`${apiUrl}/v1/problems?page=${page}&limit=20`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache",
                    ...(token && { Authorization: `Bearer ${token}` }),
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
                    navigate("/sign-in");
                    return;
                }

                accessToken = sessionStorage.getItem("accessToken");
                res = await sendRequest(accessToken);
            }

            if (res.status === 200) {
                const data = await res.json();
                setMaxPage(data.maxPage);
                setProblems(data.data);
            } else {
                toast.error("Unexpected error. Please try again.", {
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.error("Error fetching problems:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!isLoading) {
            fetchProblems();
        }
    }, [page, count]);

    useEffect(() => {
        if (problems?.length === 0 && page > 1) {
            setPage((pre) => {
                return pre - 1;
            });
        }
    }, [problems]);

    const handleDeleteProblem = async (problemId) => {
        const deleteRequest = async (token) => {
            return await fetch(`${apiUrl}/v1/problems/${problemId}`, {
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
            if (accessToken && jwtDecode(accessToken).role === "ADMIN") {
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
                    toast.success("You’ve successfully deleted the problem.", {
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
            console.error("delete problem error: ", error);
        }
    };

    return (
        <>
            {isShowWarning && (
                <Dialog
                    message={`Delete problem ${problemSelected.title}?`}
                    positiveBtnMessage="Delete"
                    negativeBtnMessage="No"
                    setIsShowDialog={setIsShowWarning}
                    action={() => {
                        handleDeleteProblem(problemSelected._id);
                        setIsShowWarning(false);
                    }}
                />
            )}
            <div className="admin-problems-container">
                <div className="admin-group-btn">
                    <button
                        className="admin-add-btn"
                        onClick={() => {
                            navigate("/admin/add-new-problem");
                        }}
                    >
                        <i className="fa-solid fa-plus" /> Add new problem
                    </button>
                </div>

                <div className={`page-loader ${isLoading ? "" : "hidden"}`}>
                    <PulseLoader
                        color="#ffffff99"
                        loading={isLoading}
                        size={10}
                    />
                </div>
                <div className="admin-problems scrollable">
                    {problems?.map((problem, index) => {
                        return (
                            <div
                                className={`admin-problems-card ${
                                    index % 2 === 0
                                        ? "dark-background"
                                        : "light-background"
                                }`}
                                key={index}
                                onClick={() => {
                                    navigate(
                                        `/admin/add-new-problem/${problem._id}`
                                    );
                                }}
                            >
                                <div className="problem">
                                    <p>{problem.title}</p>
                                    <div className="tags">
                                        <span
                                            className={
                                                problem?.difficulty === "EASY"
                                                    ? "easy-tag"
                                                    : problem?.difficulty ===
                                                      "MEDIUM"
                                                    ? "medium-tag"
                                                    : "hard-tag"
                                            }
                                        >
                                            {problem?.difficulty}
                                        </span>
                                        {problem.tags.map((tag, index) => {
                                            return (
                                                <span key={index}>{tag}</span>
                                            );
                                        })}
                                    </div>
                                </div>
                                <i
                                    className="fa-solid fa-trash admin-delete-icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setProblemSelected(problem);
                                        setIsShowWarning(true);
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
                <Footer page={page} maxPage={maxPage} setPage={setPage} />
            </div>
        </>
    );
};

export default AdminProblems;
