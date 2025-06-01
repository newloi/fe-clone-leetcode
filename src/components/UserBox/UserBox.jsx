import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import HashLoader from "react-spinners/HashLoader";

import "./UserBox.css";
import apiUrl from "@/config/api";
import refreshAccessToken from "@/api/refreshAccessToken";
import resendEmail from "@/api/resendEmail";
import Holder from "../Holder/Holder";

const UserBox = ({ isClose, setIsClose, setAvatarHome }) => {
    const [decode, setDecode] = useState(null);
    const [isCloseSettingBox, setIsCloseSettingBox] = useState(true);
    const [count, setCount] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const accessToken = sessionStorage.getItem("accessToken");
        if (accessToken) {
            const decoded = jwtDecode(accessToken);
            setDecode(decoded);
        }
    }, []);

    const [userProfile, setUserProfile] = useState();
    const [newProfile, setNewProfile] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

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
                if (res.status === 200) {
                    const data = await res.json();
                    setUserProfile(data);
                    setAvatarHome(data.avatar);
                    setNewProfile((prev) => ({
                        ...prev,
                        name: data.name,
                        previewAvatar: data.avatar,
                    }));
                } else {
                    toast.error("Unexpected error. Please try again.", {
                        autoClose: 3000,
                    });
                }
            } catch (error) {
                console.error("get profile error: ", error);
            }
        };

        if (decode?.isVerified) getProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [decode, count]);

    const handleUpdateProfile = async () => {
        setIsLoading(true);
        const updateRequest = async (token) => {
            const formData = new FormData();
            formData.append("name", newProfile.name);
            formData.append("file", newProfile.avatar);

            return await fetch(`${apiUrl}/v1/users/${userProfile._id}`, {
                method: "PATCH",
                headers: {
                    "Cache-Control": "no-cache",
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
        };

        try {
            let accessToken = sessionStorage.getItem("accessToken");
            let res = await updateRequest(accessToken);

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
                res = await updateRequest(accessToken);
            }

            if (res.status === 200) {
                setCount((prev) => prev + 1);
                setIsCloseSettingBox(true);
                toast.success("Update successful", { autoClose: 2000 });
            }
        } catch (error) {
            console.error("get profile error: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogOut = () => {
        fetch(`${apiUrl}/v1/auth/logout`, {
            method: "GET",
            credentials: "include",
        });

        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("lastVisit");
        sessionStorage.removeItem("pageSidebar");
        sessionStorage.removeItem("pageAdmin");
        sessionStorage.removeItem("activeTab");
        navigate("/sign-in");
    };

    const handleChangeName = (e) => {
        setNewProfile((prev) => ({ ...prev, name: e.target.value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewProfile((prev) => ({
                    ...prev,
                    previewAvatar: reader.result,
                    avatar: file,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            <div
                className={`overlay ${isClose ? "hidden" : ""}`}
                onClick={() => {
                    setIsCloseSettingBox(true);
                    setIsClose(true);
                }}
            />
            <div
                className={`user-box ${isClose ? "hidden" : ""} ${
                    isCloseSettingBox ? "" : "setting-box"
                }`}
            >
                {isCloseSettingBox ? (
                    <>
                        <div className="user-infor">
                            {userProfile?.avatar ? (
                                <div className="avatar-frame medium-avatar">
                                    <img src={userProfile.avatar} />
                                </div>
                            ) : (
                                <i className="fa-regular fa-circle-user big-icon" />
                            )}
                            <span>{userProfile?.name || "Username"}</span>
                        </div>
                        <div className="user-actions">
                            {!decode?.isVerified && (
                                <span
                                    onClick={() => {
                                        resendEmail(decode.email);
                                        sessionStorage.setItem(
                                            "lastVisit",
                                            location.pathname
                                        );
                                        navigate(
                                            `/sign-up/verify-email/${decode.email}`
                                        );
                                    }}
                                >
                                    <i className="fa-solid fa-user-check" />{" "}
                                    Verify Email
                                </span>
                            )}
                            <span
                                onClick={() => {
                                    setIsCloseSettingBox((prev) => !prev);
                                }}
                            >
                                <i className="fa-solid fa-gear" /> Settings
                            </span>
                            <span onClick={handleLogOut}>
                                <i className="fa-solid fa-arrow-right-from-bracket" />{" "}
                                Sign Out
                            </span>
                        </div>
                    </>
                ) : (
                    <>
                        <div
                            className="back-btn"
                            onClick={() => {
                                setIsCloseSettingBox(true);
                            }}
                        >
                            <i className="fa-solid fa-arrow-left" /> Back
                        </div>
                        {decode.isVerified ? (
                            <>
                                <div className="user-infor">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="update-avatar"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                    <label htmlFor="update-avatar">
                                        <div className="avatar-frame-square">
                                            <div className="avatar-overlay">
                                                <i className="fa-solid fa-camera" />
                                            </div>
                                            {newProfile.previewAvatar ? (
                                                <img
                                                    src={
                                                        newProfile.previewAvatar
                                                    }
                                                />
                                            ) : (
                                                <i className="fa-solid fa-user very-big-icon" />
                                            )}
                                        </div>
                                    </label>
                                    <div>
                                        <div className="edit-field">
                                            <input
                                                type="text"
                                                value={newProfile.name}
                                                onChange={handleChangeName}
                                                placeholder="New username"
                                            />
                                            <i className="fa-solid fa-pen" />
                                        </div>
                                        <p className="fs-12">{decode.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleUpdateProfile}
                                    disabled={isLoading}
                                >
                                    Update
                                </button>
                                <div className="user-actions">
                                    <span
                                        onClick={() => {
                                            sessionStorage.setItem(
                                                "lastVisit",
                                                location.pathname
                                            );
                                            navigate(
                                                `/forgot-password/change-password/${decode.email}`
                                            );
                                        }}
                                    >
                                        <i className="fa-solid fa-key" /> Change
                                        your password
                                    </span>
                                </div>
                            </>
                        ) : (
                            <Holder
                                actionText={"Verify now"}
                                action={() => {
                                    resendEmail(decode.email);
                                    sessionStorage.setItem(
                                        "lastVisit",
                                        location.pathname
                                    );
                                    navigate(
                                        `/sign-up/verify-email/${decode.email}`
                                    );
                                }}
                            />
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default UserBox;
