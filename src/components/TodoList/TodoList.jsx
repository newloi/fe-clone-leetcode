import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";

import "./TodoList.css";
import apiUrl from "@/config/api";
import refreshAccessToken from "@/api/refreshAccessToken";

const TodoList = ({ todos, setTodos }) => {
    const [removingId, setRemovingId] = useState(null);
    const navigate = useNavigate();

    const removeFromTodo = async (problemId) => {
        setRemovingId(problemId);
        const sendRequest = async (token) => {
            return await fetch(`${apiUrl}/v1/users/todos/${problemId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "x-csrf-token": sessionStorage.getItem("csrfToken"),
                    "x-service-token":
                        "fabc5c5ea0f6b4157b3bc8e23073add1e12024f4e089e5242c8d9950506b450e011b15487096787a0bd60d566fe7fd201269d1dee4ad46989d20b00f18abbbc0",
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
                        {
                            autoClose: 3000,
                        }
                    );
                    setRemovingId(null);
                    navigate("/sign-in");
                    return;
                }

                accessToken = sessionStorage.getItem("accessToken");
                res = await sendRequest(accessToken);
            }

            if (res.status === 204) {
                toast.success("Removed from todo list", { autoClose: 1500 });
                setTodos((prevTodos) =>
                    prevTodos.filter((todo) => todo._id !== problemId)
                );
            }
        } catch (error) {
            console.error("Error removing from todo:", error);
            toast.error("Failed to remove from todo list");
        } finally {
            setRemovingId(null);
        }
    };

    return (
        <div className="todo-list-container">
            <h2>My Todo List</h2>
            {todos.length === 0 ? (
                <div className="todo-list-empty">
                    Your todo list is empty. Add problems you want to solve
                    later!
                </div>
            ) : (
                <div className="todo-list">
                    {todos.map((todo, idx) => (
                        <div key={idx} className="todo-item">
                            <Link
                                to={`/problem/${todo._id}/${idx}`}
                                className="todo-link"
                                onClick={() => {
                                    sessionStorage.setItem(
                                        "pageSidebar",
                                        parseInt(idx / 10) + 1
                                    );
                                }}
                            >
                                <div className="todo-info">
                                    <span className="todo-title">
                                        {todo.title}
                                    </span>
                                    <span
                                        className={`todo-difficulty ${todo.difficulty.toLowerCase()}-tag`}
                                    >
                                        {todo.difficulty}
                                    </span>
                                </div>
                            </Link>
                            <div className="todo-actions">
                                <button
                                    className="todo-remove-btn"
                                    onClick={() => {
                                        removeFromTodo(todo._id);
                                    }}
                                    disabled={removingId === todo._id}
                                >
                                    {removingId === todo._id ? (
                                        <i className="fa fa-spinner fa-spin"></i>
                                    ) : (
                                        <i className="fa-solid fa-trash"></i>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TodoList;
