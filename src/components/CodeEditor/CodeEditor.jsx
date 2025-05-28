import Editor from "@monaco-editor/react";
import { Link, useLocation } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import { useState } from "react";

import "./CodeEditor.css";
import { useEffect } from "react";
import apiUrl from "@/config/api";

const CodeEditor = ({
    problemId,
    languages,
    setCode,
    code,
    setLanguage,
    language,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    // const [isWarning, setIsWarning] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // if (!language && !code) setIsWarning(true);
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(
                    `${apiUrl}/v1/problems/${problemId}/functions?language=${language}`
                );
                const data = await res.json();
                setCode(data.function);
            } catch (error) {
                console.error("error get function declaration: ", error);
            } finally {
                setIsLoading(false);
            }
        };
        if (language) fetchData();
    }, [language]);

    const handleChangeLanguage = (e) => {
        setLanguage(e.target.value);
    };

    return (
        <div className="code-editor-container" style={{ padding: 0 }}>
            <div className={`page-loader ${isLoading ? "" : "hidden"}`}>
                <PulseLoader color="#ffffff99" loading={isLoading} size={10} />
            </div>
            <div className="language-selected-container">
                <select
                    className="language-selected"
                    onChange={handleChangeLanguage}
                >
                    {languages?.map((language, index) => {
                        return (
                            <option key={index} value={language}>
                                {language === "javascript"
                                    ? "JavaScript"
                                    : language === "python"
                                    ? "Python"
                                    : language === "cpp"
                                    ? "C++"
                                    : "Java"}
                            </option>
                        );
                    })}
                </select>
            </div>
            {!sessionStorage.getItem("accessToken") && (
                <div className="footer-editor">
                    You need to
                    <Link
                        to="/sign-in"
                        className="blue-span"
                        onClick={() => {
                            sessionStorage.setItem(
                                "lastVisit",
                                location.pathname
                            );
                        }}
                    >
                        Login / Sign up
                    </Link>{" "}
                    to run or submit
                </div>
            )}
            {!language && (
                <div className="footer-editor">
                    We're still working on this problem. Come back soon!
                </div>
            )}
            {problemId && (
                <Editor
                    height="100%"
                    language={language}
                    value={code}
                    onChange={(newCode) => {
                        setCode(newCode);
                    }}
                    theme="vs-dark"
                />
            )}
        </div>
    );
};

export default CodeEditor;
