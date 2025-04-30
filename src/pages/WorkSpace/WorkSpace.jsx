import Split from "react-split";
import HeaderWorkspace from "../../components/Header/HeaderWorkspace";
import CodeEditor from "../../components/CodeEditor/CodeEditor";
import Problem from "../../components/Problem/Problem";
import Testcase from "../../components/Testcase/Testcase";
import Solutions from "../../components/Solutions/Solutions";
import Sidebar from "../../components/SideBar/Sidebar";
import "./WorkSpace.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiUrl from "../../config/api";

function WorkSpace() {
    const { problemId, problemIndex } = useParams();
    const [problem, setProblem] = useState({
        id: problemId,
        index: problemIndex,
    });
    const [data, setData] = useState();
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [result, setResult] = useState({});

    useEffect(() => {
        fetch(`${apiUrl}/v1/problems/${problem.id}`)
            .then((res) => res.json())
            .then((data) => {
                console.log("problem: ", data);
                setData(data);
                setLanguage(data.supports[0]);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [problem.id]);

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

    const handleSubmitCode = () => {
        fetch(`${apiUrl}/v1/submissions`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem(
                    "accessToken"
                )}`,
                "X-CSRF-Token": `${sessionStorage.getItem("csrfToken")}`,
            },
            body: JSON.stringify({
                problemId: problem.id,
                language: language,
                code: code,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setResult(data);
                console.log("result submit: ", data);
            })
            .catch((error) => {
                console.error("submit error: ", error);
            });
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
                        handleSubmitCode={handleSubmitCode}
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
                            <Problem problem={data} />
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
                                <CodeEditor
                                    problemId={problem.id}
                                    languages={data?.supports}
                                    setCode={setCode}
                                    code={code}
                                    setLanguage={setLanguage}
                                    language={language}
                                />
                            </div>
                            <div className="bottom-side block">
                                <div className="tabbar">
                                    <div className="tab">
                                        <i className="fa-regular fa-square-check green-icon" />{" "}
                                        Testcase
                                    </div>
                                </div>
                                <div className="container-tab">
                                    <Testcase
                                        examples={data?.description?.examples}
                                    />
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
