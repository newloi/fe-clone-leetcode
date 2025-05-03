import Split from "react-split";
import HeaderWorkspace from "../../components/Header/HeaderWorkspace";
import CodeEditor from "../../components/CodeEditor/CodeEditor";
import Problem from "../../components/Problem/Problem";
import Testcase from "../../components/Testcase/Testcase";
import Solutions from "../../components/Solutions/Solutions";
import Sidebar from "../../components/SideBar/Sidebar";
import Result from "../../components/Result/Result";
import Submissions from "../../components/Submissions/Submissions";
import refreshAccessToken from "../../api/refreshAccessToken";
import Solution from "../../components/Solutions/Solution";
import UserBox from "@/components/UserBox/UserBox";
import "./WorkSpace.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import apiUrl from "@/config/api";

const WorkSpace = () => {
    const { problemId, problemIndex } = useParams();
    const [problem, setProblem] = useState({
        id: problemId,
        index: problemIndex,
    });
    const [data, setData] = useState();
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [resultId, setResultId] = useState("");
    const [tab, setTab] = useState("description");
    const [solutionId, setSolutionId] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${apiUrl}/v1/problems/${problem.id}`)
            .then((res) => res.json())
            .then((data) => {
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

    const handleSubmitCode = async () => {
        const csrfToken = sessionStorage.getItem("csrfToken");

        const sendRequest = async (token) => {
            return await fetch(`${apiUrl}/v1/submissions`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "X-CSRF-Token": csrfToken,
                },
                body: JSON.stringify({
                    problemId: problem.id,
                    language: language,
                    code: code,
                }),
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
            setResultId(data._id);
            setTab("result");
        } catch (error) {
            console.error("submit error: ", error);
        }
    };

    const [isCloseUserBox, setIsCloseUserBox] = useState(true);

    return (
        <div>
            <UserBox isClose={isCloseUserBox} />
            <div className={`sidebar ${isSidebarOpen ? "" : "close"}`}>
                <Sidebar
                    toggleSidebar={toggleSidebar}
                    changeProblem={changeProblem}
                    selectedProblemIndex={problem.index}
                    newResultId={resultId}
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
                        toggleUserBox={() => {
                            setIsCloseUserBox((pre) => !pre);
                        }}
                    />
                </div>
                <Split className="split" sizes={[50, 50]}>
                    <div className="left-side block">
                        <div className="tabbar">
                            <div className="tab">
                                <button
                                    className={
                                        tab === "description"
                                            ? "active-tab"
                                            : ""
                                    }
                                    onClick={() => {
                                        setTab("description");
                                    }}
                                >
                                    <i className="fa-regular fa-pen-to-square blue-icon" />{" "}
                                    Description
                                </button>
                            </div>
                            <div className="tab">
                                <span>|</span>
                                <button
                                    className={`${
                                        tab === "solutions" ||
                                        tab === "solution"
                                            ? "active-tab"
                                            : ""
                                    }`}
                                    onClick={() => {
                                        setTab("solutions");
                                    }}
                                >
                                    <i className="fa-solid fa-flask yellow-icon" />{" "}
                                    Solutions
                                </button>
                            </div>
                            <div className="tab">
                                <span>|</span>
                                <button
                                    className={
                                        tab === "submissions"
                                            ? "active-tab"
                                            : ""
                                    }
                                    onClick={() => {
                                        setTab("submissions");
                                    }}
                                >
                                    <i className="fa-solid fa-clock-rotate-left blue-icon" />{" "}
                                    Submissions
                                </button>
                            </div>
                            <div className={`tab ${resultId ? "" : "hidden"}`}>
                                <span>|</span>
                                <button
                                    className={`${
                                        tab === "result" ? "active-tab" : ""
                                    }`}
                                    onClick={() => {
                                        setTab("result");
                                    }}
                                >
                                    <i className="fa-solid fa-square-poll-vertical green-icon" />{" "}
                                    Result
                                </button>
                            </div>
                        </div>
                        <div
                            className={`container-tab ${
                                tab === "description" ? "" : "hidden"
                            }`}
                        >
                            <Problem problem={data} />
                        </div>
                        <div
                            className={`container-tab ${
                                tab === "solutions" ? "" : "hidden"
                            }`}
                        >
                            <Solutions
                                problemId={problem.id}
                                setTabSolution={setTab}
                                setSolutionId={setSolutionId}
                            />
                        </div>
                        <div
                            className={`container-tab ${
                                tab === "solution" ? "" : "hidden"
                            }`}
                        >
                            <Solution solutionId={solutionId} setTab={setTab} />
                        </div>
                        <div
                            className={`container-tab ${
                                tab === "submissions" ? "" : "hidden"
                            }`}
                        >
                            <Submissions
                                problemId={problem.id}
                                setResultId={setResultId}
                                setTabResult={setTab}
                                newResultId={resultId}
                            />
                        </div>
                        <div
                            className={`container-tab ${
                                tab === "result" ? "" : "hidden"
                            }`}
                        >
                            <Result resultId={resultId} />
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
};

export default WorkSpace;
