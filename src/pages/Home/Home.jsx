import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HeaderHome from "@/components/Header/HeaderHome";
import "./Home.css";
import apiUrl from "@/config/api";

function Home() {
    const [problems, setProblems] = useState([]);

    useEffect(() => {
        const token = sessionStorage.getItem("accessToken");
        fetch(`${apiUrl}/v1/problems`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        })
            .then((res) => res.json())
            .then((res) => {
                console.log("problems: ", res.data);
                setProblems(res.data);
            })
            .catch((error) => console.error("Sidebar api error: ", error));
    }, []);

    return (
        <div className="container-home">
            <HeaderHome />
            <div className="body-home">
                <div className="greeting">
                    <h1>Welcome to LeetClone 🎉🎉🎉</h1>
                </div>
                <div className="problems scrollable problems-home">
                    {problems?.map((problem, index) => {
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
                                                    <span key={index}>
                                                        {tag}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <span
                                        className={`small-tag ${problem.difficulty === "EASY"
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
                    })}
                </div>
            </div>
        </div>
    );
}

export default Home;
