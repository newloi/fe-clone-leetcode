import {
    useEffect,
    useState,
    // useCallback
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import PulseLoader from "react-spinners/PulseLoader";
// import debounce from "lodash.debounce";

import "./Sidebar.css";
import apiUrl from "../../config/api";
import refreshAccessToken from "@/api/refreshAccessToken";
import Footer from "../Footer/Footer";

const Sidebar = ({ toggleSidebar, selectedProblemIndex, newResultId }) => {
    const [problems, setProblems] = useState(null);
    const [page, setPage] = useState(
        Number(sessionStorage.getItem("pageSidebar")) || 1
    );
    const [maxPage, setMaxPage] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        sessionStorage.setItem("pageSidebar", page.toString());
    }, [location.pathname]);

    // useEffect(() => {
    //     const handleBeforeUnload = () => {
    //         sessionStorage.setItem("pageSidebar", page.toString());
    //     };

    //     window.addEventListener("beforeunload", handleBeforeUnload);

    //     return () => {
    //         window.removeEventListener("beforeunload", handleBeforeUnload);
    //     };
    // }, [page]);

    useEffect(() => {
        const fetchProblems = async () => {
            setIsLoading(true);
            const sendRequest = async (token) => {
                return await fetch(`${apiUrl}/v1/problems?page=${page}`, {
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
                    // if (page === 1) {
                    //     setProblems(() => {
                    //         sessionStorage.setItem(
                    //             "problems",
                    //             JSON.stringify(data.data)
                    //         );
                    //         return data.data;
                    //     });
                    // } else
                    //     setProblems((prev) => {
                    //         // sessionStorage.setItem(
                    //         //     "problems",
                    //         //     JSON.stringify([...prev, ...data.data])
                    //         // );
                    //         return [...prev, ...data.data];
                    //     });
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

        // const pageSidebar = sessionStorage.getItem("pageSidebar");
        // if (!pageSidebar || (page >= Number(pageSidebar) && page < maxPage)) {
        //     console.log(page);

        if (!isLoading) {
            fetchProblems();
        }
        // }
    }, [newResultId, page]);

    useEffect(() => {
        const size = problems?.length;

        if (size > 0) {
            const currProblemIndex =
                ((selectedProblemIndex % size) + size) % size;
            navigate(
                `/problem/${problems[currProblemIndex]._id}/${currProblemIndex}`
            );
        }
    }, [selectedProblemIndex, problems]);

    // const handleScroll = useCallback(
    //     debounce(() => {
    //         if (page < maxPage && !isLoading) {
    //             const scrollTop = window.scrollY;
    //             const windowHeight = window.innerHeight;
    //             const documentHeight = document.documentElement.scrollHeight;

    //             if (scrollTop + windowHeight >= documentHeight - 500) {
    //                 setPage((prev) => {
    //                     // const pageSidebar =
    //                     //     sessionStorage.getItem("pageSidebar");
    //                     // if (!pageSidebar || prev + 1 > Number(pageSidebar))
    //                     //     sessionStorage.setItem("pageSidebar", prev + 1);
    //                     return prev + 1;
    //                 });
    //             }
    //         }
    //     }, 500),
    //     [page, maxPage]
    // );

    return (
        <div className="container-sidebar">
            <div className="header-sidebar">
                <span>List Of Problems</span>
                <button onClick={toggleSidebar}>
                    <i className="fa-solid fa-xmark" />
                </button>
            </div>
            <div className="mobile-footer">
                <Footer page={page} setPage={setPage} maxPage={maxPage} />{" "}
            </div>

            <div
                className={`page-loader ${
                    isLoading || !problems ? "" : "hidden"
                }`}
            >
                <PulseLoader
                    color="#ffffff99"
                    loading={isLoading || !problems}
                    size={10}
                />
            </div>

            {problems && (
                <div
                    className="problems scrollable"
                    // onScroll={handleScroll}
                >
                    {problems?.map((problem, index) => {
                        return (
                            <div
                                key={index}
                                className={`problem-card ${
                                    selectedProblemIndex === index
                                        ? "selected"
                                        : ""
                                }`}
                                onClick={() => {
                                    navigate(
                                        `/problem/${problem._id}/${index}`
                                    );
                                    toggleSidebar();
                                }}
                            >
                                <i
                                    className={
                                        problem.status === "SOLVED"
                                            ? "fa-regular fa-circle-check solved-icon"
                                            : problem.status === "ATTEMPTED"
                                            ? "fa-solid fa-circle-half-stroke attempted-icon"
                                            : "fa-regular fa-circle unsolved-icon"
                                    }
                                />
                                <div className="problem">
                                    <p>{problem.title}</p>
                                    <div className="tags">
                                        {problem.tags.map((tag, index) => {
                                            return (
                                                <span key={index}>{tag}</span>
                                            );
                                        })}
                                    </div>
                                </div>
                                <span
                                    className={`small-tag ${
                                        problem.difficulty === "EASY"
                                            ? "easy-tag"
                                            : problem.difficulty === "MEDIUM"
                                            ? "medium-tag"
                                            : "hard-tag"
                                    }`}
                                >
                                    {problem.difficulty}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="desktop-footer">
                <Footer page={page} setPage={setPage} maxPage={maxPage} />
            </div>
        </div>
    );
};

export default Sidebar;
