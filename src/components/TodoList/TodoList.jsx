import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";

import "./TodoList.css";
import apiUrl from "@/config/api";
import refreshAccessToken from "@/api/refreshAccessToken";

const TodoList = ({ triggerRefreshKey, onChange }) => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [removingId, setRemovingId] = useState(null);
    const navigate = useNavigate();

    const fetchTodos = async () => {
        setLoading(true);
        const sendRequest = async (token) => {
            return await fetch(`${apiUrl}/v1/users/todos?page=1&limit=50`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache",
                    Authorization: `Bearer ${token}`,
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
                    navigate("/sign-in");
                    return;
                }

                accessToken = sessionStorage.getItem("accessToken");
                res = await sendRequest(accessToken);
            }

            if (res.status === 200) {
                const data = await res.json();
                setTodos(Array.isArray(data) ? data : data.data || []);
            }
        } catch (error) {
            console.error("Error fetching todos:", error);
            toast.error("Failed to load todo list");
        } finally {
            setLoading(false);
        }
    };

    // const addToTodo = async (problemId) => {
    //     const sendRequest = async (token) => {
    //         return await fetch(`${apiUrl}/v1/users/todos`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 Authorization: `Bearer ${token}`,
    //                 "x-csrf-token": sessionStorage.getItem("csrfToken"),
    //                 "x-service-token":
    //                     "fabc5c5ea0f6b4157b3bc8e23073add1e12024f4e089e5242c8d9950506b450e011b15487096787a0bd60d566fe7fd201269d1dee4ad46989d20b00f18abbbc0",
    //             },
    //             body: JSON.stringify({ problems: [problemId] }),
    //         });
    //     };

    //     try {
    //         let accessToken = sessionStorage.getItem("accessToken");
    //         let res = await sendRequest(accessToken);

    //         if (res.status === 401) {
    //             const refreshed = await refreshAccessToken();
    //             if (!refreshed) {
    //                 toast.error(
    //                     "Your session has expired. Please log in again.",
    //                     {
    //                         autoClose: 3000,
    //                     }
    //                 );
    //                 navigate("/sign-in");
    //                 return;
    //             }

    //             accessToken = sessionStorage.getItem("accessToken");
    //             res = await sendRequest(accessToken);
    //         }

    //         if (res.status === 201) {
    //             toast.success("Added to todo list");
    //             fetchTodos();
    //             if (onChange) onChange();
    //         }
    //     } catch (error) {
    //         console.error("Error adding to todo:", error);
    //         toast.error("Failed to add to todo list");
    //     }
    // };

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
                if (onChange) onChange();
            }
        } catch (error) {
            console.error("Error removing from todo:", error);
            toast.error("Failed to remove from todo list");
        } finally {
            setRemovingId(null);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, [triggerRefreshKey]);

    if (loading) {
        <div className={`page-loader ${loading ? "" : "hidden"}`}>
            <PulseLoader color="#ffffff99" loading={loading} size={10} />
        </div>;
    }

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
