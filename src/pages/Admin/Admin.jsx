import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import "./Admin.css";
import logo from "../../assets/logo-dark.png";
import apiUrl from "@/config/api";
import Dialog from "@/components/Dialog/Dialog";

const Admin = () => {
    const [isShowWarning, setIsShowWarning] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem("accessToken");
        if (!token || jwtDecode(token).role === "USER") setIsShowWarning(true);
    }, []);

    const handleLogOut = () => {
        fetch(`${apiUrl}/v1/auth/logout`, {
            method: "GET",
            credentials: "include",
        });

        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("lastVisit");
        sessionStorage.removeItem("pageSidebar");
        sessionStorage.removeItem("pageAdmin");
        navigate("/sign-in");
    };

    return (
        <>
            {isShowWarning && (
                <Dialog
                    message={`You are on the admin page. Please go back to the homepage.`}
                    positiveBtnMessage="Go"
                    // negativeBtnMessage="No"
                    // setIsShowDialog={setIsShowWarning}
                    action={() => {
                        navigate("/");
                        setIsShowWarning(false);
                    }}
                />
            )}
            <div className="admin-container">
                <div className="admin-sidebar">
                    <div className="admin-logo">
                        <img src={logo} alt="LeetClone" /> LeetClone
                    </div>

                    <div className="admin-group-tabbar">
                        <div
                            className="admin-tab"
                            onClick={() => {
                                navigate("/");
                            }}
                        >
                            <i className="fa-solid fa-house-user" /> Home
                        </div>
                        <div
                            className="admin-tab"
                            onClick={() => {
                                navigate("/admin/problems");
                            }}
                        >
                            <i className="fa-solid fa-pen-to-square" /> Problems
                        </div>
                        <div
                            className="admin-tab"
                            onClick={() => {
                                navigate("/admin/users");
                            }}
                        >
                            <i className="fa-solid fa-users" /> Users
                        </div>
                    </div>
                    <div className="admin-group-actions">
                        <div className="admin-tab">
                            <i className="fa-solid fa-gears" /> Settings
                        </div>
                        <div className="admin-tab" onClick={handleLogOut}>
                            <i className="fa-solid fa-right-from-bracket" /> Log
                            out
                        </div>
                    </div>
                </div>
                <div className="admin-content">
                    <div className="admin-header">
                        <div className="admin-infor">
                            <i className="fa-regular fa-circle-user" /> Admin
                        </div>
                    </div>
                    <div className="admin-main-content">
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Admin;
