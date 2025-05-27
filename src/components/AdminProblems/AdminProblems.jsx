import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import debounce from "lodash.debounce";
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
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    const navigate = useNavigate();

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

    useEffect(() => {
        setPage(1);
    }, [searchQuery]);

    const debouncedSearch = useCallback(
        debounce(async (query) => {
            if (query.trim() === "") {
                setIsSearching(false);
                return;
            }

            try {
                setIsSearching(true);
                const token = sessionStorage.getItem("accessToken");
                const response = await fetch(
                    `${apiUrl}/v1/problems/search?term=${encodeURIComponent(
                        query
                    )}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            ...(token && { Authorization: `Bearer ${token}` }),
                        },
                    }
                );
                const data = await response.json();
                setProblems(data.data);
                setMaxPage(data.maxPage);
            } catch (error) {
                console.error("Error searching problems:", error);
            }
        }, 500),
        []
    );

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim() === "") {
            debouncedSearch.cancel();
            setIsSearching(false);
            fetchProblems();
        } else {
            debouncedSearch(query);
        }
    };

    const handleClearSearch = () => {
        setSearchQuery("");
        debouncedSearch.cancel();
        setIsSearching(false);
        fetchProblems();
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
                    <div className="admin-searchbar">
                        <i className="fa-solid fa-search search-icon"></i>
                        <input
                            type="text"
                            placeholder="Search problems by title or tag..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        {searchQuery && (
                            <i
                                className="fa-solid xmark"
                                onClick={handleClearSearch}
                            ></i>
                        )}
                    </div>
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
                    {isSearching && problems?.length === 0 ? (
                        <div className="no-results">
                            <p>No problems found matching "{searchQuery}"</p>
                        </div>
                    ) : (
                        problems?.map((problem, index) => {
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
                                                    problem?.difficulty ===
                                                    "EASY"
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
                                                    <span key={index}>
                                                        {tag}
                                                    </span>
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
                        })
                    )}
                </div>
                <Footer page={page} maxPage={maxPage} setPage={setPage} />
            </div>
        </>
    );
};

export default AdminProblems;
