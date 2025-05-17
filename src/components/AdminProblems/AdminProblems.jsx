import { useState, useEffect } from "react";

import "./AdminProblems.css";
import apiUrl from "@/config/api";
import Footer from "../Footer/Footer";

const AdminProblems = ({ setAction }) => {
    const [problems, setProblems] = useState([]);
    const [page, setPage] = useState(1);
    const [maxPage, setMaxPage] = useState();

    useEffect(() => {
        const token = sessionStorage.getItem("accessToken");
        fetch(`${apiUrl}/v1/problems?page=${page}&limit=20`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        })
            .then((res) => res.json())
            .then((res) => {
                setMaxPage(res.maxPage);
                setProblems(res.data);
            })
            .catch((error) => console.error("home api error: ", error));
    }, [page]);

    return (
        <div className="admin-problems-container">
            <div className="admin-group-btn">
                <button
                    className="admin-add-btn"
                    onClick={() => {
                        setAction("add");
                    }}
                >
                    <i className="fa-solid fa-plus" /> Add new problem
                </button>
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
                                        return <span key={index}>{tag}</span>;
                                    })}
                                </div>
                            </div>
                            <i className="fa-solid fa-trash admin-delete-icon" />
                        </div>
                    );
                })}
            </div>
            <Footer page={page} maxPage={maxPage} setPage={setPage} />
        </div>
    );
};

export default AdminProblems;
