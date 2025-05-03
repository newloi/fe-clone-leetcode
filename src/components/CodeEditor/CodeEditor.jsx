import Editor from "@monaco-editor/react";
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
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(
                    `${apiUrl}/v1/problems/${problemId}/functions?language=${language}`
                );
                const data = await res.json();
                setCode(data.function);
            } catch (error) {
                console.error("error get function declaration: ", error);
            }
        };
        fetchData();
    }, [language, problemId]);

    const handleChangeLanguage = (e) => {
        setLanguage(e.target.value);
    };

    return (
        <div className="code-editor-container" style={{ padding: 0 }}>
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
            {/* <hr className="light-line" /> */}
            <Editor
                height="100%"
                language={language}
                value={code}
                onChange={(newCode) => {
                    setCode(newCode);
                }}
                theme="vs-dark"
            />
        </div>
    );
};

export default CodeEditor;
