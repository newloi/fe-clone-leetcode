import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import "./UserBox.css";
import apiUrl from "@/config/api";
import refreshAccessToken from "@/api/refreshAccessToken";
import resendEmail from "@/api/resendEmail";

const UserBox = ({ isClose, setIsClose }) => {
    const [decode, setDecode] = useState(null);

    useEffect(() => {
        const accessToken = sessionStorage.getItem("accessToken");
        if (accessToken) {
            const decoded = jwtDecode(accessToken);
            setDecode(decoded);
        }
    }, []);

    const [userProfile, setUserProfile] = useState();
    const navigate = useNavigate();
    useEffect(() => {
        const getProfile = async () => {
            const sendRequest = async (token) => {
                return await fetch(`${apiUrl}/v1/users/profile`, {
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
                const data = await res.json();
                setUserProfile(data);
            } catch (error) {
                console.error("get profile error: ", error);
            }
        };

        if (decode?.isVerified) getProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [decode]);

    const handleLogOut = () => {
        fetch(`${apiUrl}/v1/auth/logout`, {
            method: "GET",
            credentials: "include",
        });

        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("lastVisit");
        navigate("/sign-in");
    };

    return (
        <>
            <div
                className={`overlay ${isClose ? "hidden" : ""}`}
                onClick={() => {
                    setIsClose(true);
                }}
            ></div>
            <div className={`user-box ${isClose ? "hidden" : ""}`}>
                <div className="user-infor">
                    <i className="fa-regular fa-circle-user big-icon" />{" "}
                    <span>{userProfile?.name || "Username"}</span>
                </div>
                <div className="user-actions">
                    {!decode?.isVerified && (
                        <span
                            onClick={() => {
                                resendEmail(decode.email);
                                navigate(
                                    `/sign-up/verify-email/${decode.email}`
                                );
                            }}
                        >
                            <i className="fa-solid fa-user-check" /> Verify
                            Email
                        </span>
                    )}
                    <span>
                        <i className="fa-solid fa-gear" /> Settings
                    </span>
                    <span onClick={handleLogOut}>
                        <i className="fa-solid fa-arrow-right-from-bracket" />{" "}
                        Sign Out
                    </span>
                </div>
            </div>
        </>
    );
};

export default UserBox;
