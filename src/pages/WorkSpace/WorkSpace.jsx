import Split from "react-split";
import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams,
    useLocation,
    useOutletContext,
} from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import HashLoader from "react-spinners/HashLoader";

import HeaderWorkspace from "../../components/Header/HeaderWorkspace";
import CodeEditor from "../../components/CodeEditor/CodeEditor";
import Problem from "../../components/Problem/Problem";
import Testcase from "../../components/Testcase/Testcase";
import Solutions from "../../components/Solutions/Solutions";
import Result from "../../components/Result/Result";
import Submissions from "../../components/Submissions/Submissions";
import refreshAccessToken from "../../api/refreshAccessToken";
import Solution from "../../components/Solutions/Solution";
import "./WorkSpace.css";
import apiUrl from "@/config/api";
import Holder from "@/components/Holder/Holder";
import resendEmail from "@/api/resendEmail";

const WorkSpaceWrapper = () => {
    const { problemId, problemIndex } = useParams();

    return (
        <WorkSpace
            key={problemId}
            problemId={problemId}
            problemIndex={problemIndex}
        />
    );
};

const WorkSpace = ({ problemId, problemIndex }) => {
    const { toggleSidebar, setIndex } = useOutletContext();

    useEffect(() => {
        setIndex(Number(problemIndex));
    }, [problemIndex]);

    const [resultId, setResultId] = useState("");
    const [data, setData] = useState();
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("");

    const [tab, setTab] = useState("description");
    const [solutionId, setSolutionId] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingData, setIsFetchingData] = useState(false);

    const [decode, setDecode] = useState(null);

    useEffect(() => {
        const accessToken = sessionStorage.getItem("accessToken");
        if (accessToken) {
            const decoded = jwtDecode(accessToken);
            setDecode(decoded);
        }
    }, []);

    useEffect(() => {
        setIsFetchingData(true);
        fetch(`${apiUrl}/v1/problems/${problemId}`)
            .then((res) => res.json())
            .then((data) => {
                setData(data);
                setLanguage(data.supports[0]);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setIsFetchingData(false);
            });
    }, []);

    const preProblem = () => {
        setIndex((prev) => prev - 1);
    };

    const nextProblem = () => {
        setIndex((prev) => prev + 1);
    };

    const handleSubmitCode = async () => {
        setIsLoading(true);
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
                    problemId: problemId,
                    language: language,
                    code: code,
                }),
            });
        };

        try {
            let accessToken = sessionStorage.getItem("accessToken");
            if (accessToken) {
                if (decode.isVerified) {
                    let res = await sendRequest(accessToken);

                    if (res.status === 401) {
                        const refreshed = await refreshAccessToken();
                        if (!refreshed) {
                            toast.error(
                                "Your session has expired. Please log in again.",
                                { autoClose: 3000 }
                            );
                            sessionStorage.setItem(
                                "lastVisit",
                                location.pathname
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
                } else
                    toast.error(
                        ({ closeToast }) => (
                            <div className="toast-with-btn">
                                <span>You need to Verify email to Submit.</span>
                                <button
                                    onClick={() => {
                                        closeToast();
                                        sessionStorage.setItem(
                                            "lastVisit",
                                            location.pathname
                                        );
                                        resendEmail(decode.email);
                                        navigate(
                                            `/sign-up/verify-email/${decode.email}`
                                        );
                                    }}
                                >
                                    Verify now!
                                </button>
                            </div>
                        ),
                        {
                            autoClose: 3000,
                        }
                    );
            } else
                toast.error("You need to Log in to Submit.", {
                    autoClose: 3000,
                });
        } catch (error) {
            console.error("submit error: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div
                className={`dark-overlay overlay overall-overlay ${
                    isLoading ? "" : "hidden"
                }`}
            >
                <HashLoader color="#36d7b7" loading={isLoading} size={35} />
            </div>
            <div className="workspace-container">
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
                            <Problem
                                problem={data}
                                isLoading={isFetchingData}
                            />
                        </div>
                        <div
                            className={`container-tab ${
                                tab === "solutions" ? "" : "hidden"
                            }`}
                        >
                            <Solutions
                                problemId={problemId}
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
                            {sessionStorage.getItem("accessToken") ? (
                                decode?.isVerified ? (
                                    <Submissions
                                        problemId={problemId}
                                        setResultId={setResultId}
                                        setTabResult={setTab}
                                        newResultId={resultId}
                                    />
                                ) : (
                                    <Holder
                                        text="View your Submission records here"
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
                                )
                            ) : (
                                <Holder
                                    text="View your Submission records here"
                                    actionText={"Register or Sign In"}
                                    action={() => {
                                        sessionStorage.setItem(
                                            "lastVisit",
                                            location.pathname
                                        );
                                        navigate("/sign-in");
                                    }}
                                />
                            )}
                        </div>
                        <div
                            className={`container-tab ${
                                tab === "result" ? "" : "hidden"
                            }`}
                        >
                            <Result
                                resultId={resultId}
                                setResultId={setResultId}
                            />
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
                                    problemId={problemId}
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
                                        isLoading={isFetchingData}
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

export default WorkSpaceWrapper;
