import Split from "react-split";
import HeaderWorkspace from "../../components/Header/HeaderWorkspace";
import CodeEditor from "../../components/CodeEditor/CodeEditor";
import Problem from "../../components/Problem/Problem";
import Testcase from "../../components/Testcase/Testcase";
import "./WorkSpace.css";

function WorkSpace() {
    return (
        <div className="workspace-container">
            <div className="header-workspace">
                <HeaderWorkspace />
            </div>
            <Split className="split" sizes={[50, 50]}>
                <div className="left-side block">
                    <div className="tabbar">
                        <div className="tab">
                            <i className="fa-regular fa-pen-to-square blue-icon" />{" "}
                            Description
                        </div>
                    </div>
                    <Problem />
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
                            <CodeEditor />
                        </div>
                        <div className="bottom-side block">
                            <div className="tabbar">
                                <div className="tab">
                                    <i className="fa-regular fa-square-check green-icon" />{" "}
                                    Testcase
                                </div>
                            </div>
                            <Testcase />
                        </div>
                    </Split>
                </div>
            </Split>
        </div>
    );
}

export default WorkSpace;
