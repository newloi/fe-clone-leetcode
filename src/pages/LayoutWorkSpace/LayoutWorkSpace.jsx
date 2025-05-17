import { Outlet } from "react-router-dom";
import { useState } from "react";

import Sidebar from "@/components/Sidebar/Sidebar";

const LayoutWorkSpace = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [index, setIndex] = useState(null);

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    return (
        <div>
            <div className={`sidebar ${isSidebarOpen ? "" : "close"}`}>
                <Sidebar
                    toggleSidebar={toggleSidebar}
                    selectedProblemIndex={index}
                    // newResultId={resultId}
                />
            </div>
            <div
                className={`overlay dark-overlay ${
                    isSidebarOpen ? "" : "hidden"
                }`}
                onClick={toggleSidebar}
            />
            <Outlet
                context={{
                    toggleSidebar,
                    setIndex,
                }}
            />
        </div>
    );
};

export default LayoutWorkSpace;
