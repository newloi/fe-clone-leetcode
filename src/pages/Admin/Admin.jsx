// import { useState } from "react";
import { Outlet } from "react-router-dom";

import "./Admin.css";
import AdminProblems from "@/components/AdminProblems/AdminProblems";
import logo from "../../assets/logo-dark.png";
import AddNewProblem from "@/components/AddNewProblem/AddNewProblem";

const Admin = () => {
    return (
        <div className="admin-container">
            <div className="admin-sidebar">
                <div className="admin-logo">
                    <img src={logo} alt="LeetClone" /> LeetClone
                </div>
                <div className="admin-group-tabbar">
                    <div className="admin-tab">
                        <i className="fa-solid fa-pen-to-square" /> Problems
                    </div>
                    <div className="admin-tab">
                        <i className="fa-solid fa-users" /> Users
                    </div>
                </div>
                <div className="admin-group-actions">
                    <div className="admin-tab">
                        <i className="fa-solid fa-gears" /> Settings
                    </div>
                    <div className="admin-tab">
                        <i className="fa-solid fa-right-from-bracket" /> Log out
                    </div>
                </div>
            </div>
            <div className="admin-content">
                <div className="admin-header">
                    <div className="admin-searchbar">
                        <div>
                            <i className="fa-solid fa-magnifying-glass" />{" "}
                            <input type="text" placeholder="Search..." />{" "}
                            <i className="fa-solid fa-xmark" />
                        </div>
                    </div>
                    <div className="admin-infor">
                        <i className="fa-regular fa-circle-user" /> Admin
                    </div>
                </div>
                <div className="admin-main-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Admin;
