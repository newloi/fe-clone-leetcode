import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import HeaderHome from "@/components/Header/HeaderHome";
import "./Home.css";
import apiUrl from "@/config/api";
import Footer from "@/components/Footer/Footer";
import debounce from "lodash.debounce";

const Home = () => {
    const [problems, setProblems] = useState([]);

    const [page, setPage] = useState(1);
    const [maxPage, setMaxPage] = useState();
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    const fetchProblems = async () => {
        try {
            const token = sessionStorage.getItem("accessToken");
            const response = await fetch(`${apiUrl}/v1/problems?page=${page}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });
            const data = await response.json();
            setMaxPage(data.maxPage);
            setProblems(data.data);
        } catch (error) {
            console.error("Error fetching problems:", error);
        }
    };

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

    return (
        <div className="container-home">
            <HeaderHome />
            <div className="body-home">
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

                <div className="problems scrollable problems-home">
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
            </div>
            <div className="footer-home">
                <Footer page={page} setPage={setPage} maxPage={maxPage} />
            </div>
        </div>
    );
};

export default Home;
