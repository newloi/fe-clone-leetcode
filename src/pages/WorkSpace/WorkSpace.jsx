import Split from "react-split";
import HeaderWorkspace from "../../components/Header/HeaderWorkspace";
import CodeEditor from "../../components/CodeEditor/CodeEditor";
import Problem from "../../components/Problem/Problem";
import Testcase from "../../components/Testcase/Testcase";
import Solutions from "../../components/Solutions/Solutions";
import Sidebar from "../../components/SideBar/Sidebar";
import "./WorkSpace.css";
import { useState } from "react";
// import { useParams } from "react-router-dom";

function WorkSpace() {
    // const { problemId } = useParams();
    const [problem, setProblem] = useState({
        id: "67fa1dd828c4fae7214739d0",
        index: 3,
    });

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    const changeProblem = (newId, newIndex) => {
        setProblem({ id: newId, index: newIndex });
    };

    const preProblem = () => {
        setProblem((prev) => ({ id: prev.id, index: prev.index - 1 }));
    };

    const nextProblem = () => {
        setProblem((prev) => ({ id: prev.id, index: prev.index + 1 }));
    };

    return (
        <div>
            <div className={`sidebar ${isSidebarOpen ? "" : "close"}`}>
                <Sidebar
                    toggleSidebar={toggleSidebar}
                    changeProblem={changeProblem}
                    selectedProblemIndex={problem.index}
                />
            </div>
            <div className="workspace-container">
                <div
                    className={`overlay ${isSidebarOpen ? "" : "hidden"}`}
                    onClick={toggleSidebar}
                />
                <div className="header-workspace">
                    <HeaderWorkspace
                        toggleSidebar={toggleSidebar}
                        preProblem={preProblem}
                        nextProblem={nextProblem}
                    />
                </div>
                <Split className="split" sizes={[50, 50]}>
                    <div className="left-side block">
                        <div className="tabbar">
                            <div className="tab">
                                <i className="fa-regular fa-pen-to-square blue-icon" />{" "}
                                Description
                            </div>
                            {/* <div className="tab">
                                <i class="fa-solid fa-flask" /> Solutions
                            </div> */}
                        </div>
                        <div className="container-tab">
                            <Problem problemId={problem.id} />
                        </div>
                        <div className="hidden-tab container-tab">
                            <Solutions />
                        </div>
                    </div>
                    <div className="right-side">
                        <Split
                            className="split-vertical"
                            direction="vertical"
                            sizes={[65, 35]}
                        >
                            <div className="top-side block">
                                <div className="tabbar">
                                    <div className="tab">
                                        <i className="fa-solid fa-code green-icon" />{" "}
                                        Code
                                    </div>
                                </div>
                                <CodeEditor problemId={problem.id} />
                            </div>
                            <div className="bottom-side block">
                                <div className="tabbar">
                                    <div className="tab">
                                        <i className="fa-regular fa-square-check green-icon" />{" "}
                                        Testcase
                                    </div>
                                </div>
                                <div className="container-tab">
                                    <Testcase problemId={problem.id} />
                                </div>
                            </div>
                        </Split>
                    </div>
                </Split>
            </div>
        </div>
    );
}

export default WorkSpace;
