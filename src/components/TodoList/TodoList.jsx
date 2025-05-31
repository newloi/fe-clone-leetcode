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

    // 1. Fetch toàn bộ todos
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

            if (res.ok) {
                const data = await res.json();
                // Giả sử API trả về { data: [ ...todos ] }
                const arr = Array.isArray(data) ? data : data.data || [];
                setTodos(arr);
            } else {
                // Nếu server trả lỗi (non-401), vẫn báo lên toast mà không crash
                const errorText = await res.text();
                console.error("Fetch todos failed:", errorText);
                toast.error("Failed to load todo list");
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

        try {
            let accessToken = sessionStorage.getItem("accessToken");
            let res = await sendRequest(accessToken);

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

            if (res.ok) {
                toast.success("Added to todo list");
                fetchTodos();
                if (onChange) onChange();
            } else {
                const errText = await res.text();
                toast.error(`Failed to add: ${errText}`);
            }
        } catch (error) {
            console.error("Error adding to todo:", error);
            toast.error("Failed to add to todo list");
        }
    };

    // 3. Xóa problem khỏi todo
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

                // 3.2: Nếu parent cần biết đã thay đổi, gọi onChange()
                if (onChange) onChange();
            } else {
                // Nếu server không trả ok (200/204), ta vẫn log và báo lỗi
                const errText = await res.text();
                console.error("Remove todo failed:", errText);
                toast.error(`Failed to remove: ${errText}`);
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
        return <div className="todo-list-loading">Loading...</div>;
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
