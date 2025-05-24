import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import debounce from "lodash.debounce";
import PulseLoader from "react-spinners/PulseLoader";

import HeaderHome from "@/components/Header/HeaderHome";
import "./Home.css";
import apiUrl from "@/config/api";
import resendEmail from "@/api/resendEmail";
import Dialog from "@/components/Dialog/Dialog";
import refreshAccessToken from "@/api/refreshAccessToken";

const Home = () => {
    const [problems, setProblems] = useState([]);
    const [page, setPage] = useState(1);
    const [maxPage, setMaxPage] = useState();
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [isShowBanner, setIsShowBanner] = useState(false);
    const [decode, setDecode] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const accessToken = queryParams.get("accessToken");
        const csrfToken = queryParams.get("csrfToken");

        if (accessToken && csrfToken) {
            sessionStorage.setItem("accessToken", accessToken);
            sessionStorage.setItem("csrfToken", csrfToken);

            navigate("/", { replace: true });
        }
    }, [location.search, navigate]);

    useEffect(() => {
        const token = sessionStorage.getItem("accessToken");
        if (token) {
            const decoded = jwtDecode(token);
            setDecode(decoded);
            setIsShowBanner(!decoded.isVerified);
        }
    }, []);

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
                if (page === 1) setProblems(data.data);
                else setProblems((prev) => [...prev, ...data.data]);
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
        setPage(1);
    }, [searchQuery]);

    useEffect(() => {
        if (!isSearching) {
            fetchProblems();
        }
    }, [page, isSearching]);

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

    return (
        <div className="container-home">
            <HeaderHome />
            {isShowBanner && (
                <Dialog
                    message="Please verify your email to unlock more features!"
                    positiveBtnMessage="Verify"
                    negativeBtnMessage="Not now"
                    action={() => {
                        resendEmail(decode.email);
                        navigate(`/sign-up/verify-email/${decode.email}`);
                    }}
                    setIsShowDialog={setIsShowBanner}
                />
            )}
            <div className="body-home" onScroll={handleScroll}>
                <div className="greeting">
                    <h1>Welcome to LeetClone 🎉🎉🎉</h1>
                </div>

                <div className="search-container">
                    <div className="search-box">
                        <i className="fa-solid fa-search search-icon"></i>
                        <input
                            type="text"
                            placeholder="Search problems by title or tag..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="search-input"
                        />
                        {searchQuery && (
                            <i
                                className="fa-solid fa-times clear-icon"
                                onClick={handleClearSearch}
                            ></i>
                        )}
                    </div>
                </div>

                {/* <div className="footer-home mobile-footer">
                    <Footer page={page} setPage={setPage} maxPage={maxPage} />
                </div> */}

                <div className="problems problems-home">
                    {isSearching && problems.length === 0 ? (
                        <div className="no-results">
                            <p>No problems found matching "{searchQuery}"</p>
                        </div>
                    ) : (
                        problems?.map((problem, index) => {
                            return (
                                <Link
                                    key={index}
                                    to={`/problem/${problem._id}/${index}`}
                                    onClick={() => {
                                        sessionStorage.setItem(
                                            "pageSidebar",
                                            parseInt(index / 10) + 1
                                        );
                                    }}
                                >
                                    <div className={"problem-card"}>
                                        <i
                                            className={
                                                problem.status === "SOLVED"
                                                    ? "fa-regular fa-circle-check solved-icon"
                                                    : problem.status ===
                                                      "ATTEMPTED"
                                                    ? "fa-solid fa-circle-half-stroke attempted-icon"
                                                    : "fa-regular fa-circle unsolved-icon"
                                            }
                                        />
                                        <div className="problem">
                                            <p>{problem.title}</p>
                                            <div className="tags">
                                                {problem.tags.map(
                                                    (tag, index) => {
                                                        return (
                                                            <span key={index}>
                                                                {tag}
                                                            </span>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        </div>
                                        <span
                                            className={`small-tag ${
                                                problem.difficulty === "EASY"
                                                    ? "easy-tag"
                                                    : problem.difficulty ===
                                                      "MEDIUM"
                                                    ? "medium-tag"
                                                    : "hard-tag"
                                            }`}
                                        >
                                            {problem.difficulty}
                                        </span>
                                    </div>
                                </Link>
                            );
                        })
                    )}
                </div>
                <div className="scroll-loader">
                    <PulseLoader
                        color="#ffffff99"
                        loading={isLoading}
                        size={10}
                    />
                </div>
            </div>
            {/* <div className="footer-home desktop-footer">
                <Footer page={page} setPage={setPage} maxPage={maxPage} />
            </div> */}
        </div>
    );
};

export default Home;
