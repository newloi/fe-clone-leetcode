import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import debounce from "lodash.debounce";
import PulseLoader from "react-spinners/PulseLoader";

import "./AdminUsers.css";
import apiUrl from "@/config/api";
import refreshAccessToken from "@/api/refreshAccessToken";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [maxPage, setMaxPage] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const getAllUsers = async () => {
        setIsLoading(true);
        const sendRequest = async (token) => {
            return await fetch(`${apiUrl}/v1/users?page=${page}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache",
                    Authorization: `Bearer ${token}`,
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
                if (page === 1) setUsers(data.data);
                else setUsers((prev) => [...prev, ...data.data]);
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
        getAllUsers();
    }, [page]);

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
        <div
            className="admin-users-container scrollable"
            onScroll={handleScroll}
        >
            <div className="admin-users">
                {users?.map((user, index) => (
                    <div key={index} className="admin-user-card">
                        {user.avatar ? (
                            <div className="avatar-frame big-avatar">
                                <img src={user.avatar} />
                            </div>
                        ) : (
                            <i className="fa-regular fa-user-circle" />
                        )}
                        <span>{user.name}</span>
                        <span>{user._id}</span>
                    </div>
                ))}
            </div>
            <div className="scroll-loader">
                <PulseLoader color="#ffffff99" loading={isLoading} size={10} />
            </div>
        </div>
    );
};

export default AdminUsers;
