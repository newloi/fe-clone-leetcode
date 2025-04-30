import Editor from "@monaco-editor/react";
import "./CodeEditor.css";
import { useEffect } from "react";
import apiUrl from "../../config/api";

function CodeEditor({
    problemId,
    languages,
    setCode,
    code,
    setLanguage,
    language,
}) {
    // const [code, setCode] = useState("");
    // const [language, setLanguage] = useState("javascript");

    useEffect(() => {
        fetch(
            `${apiUrl}/v1/problems/${problemId}/functions?language=${language}`
        )
            .then((res) => res.json())
            .then((data) => {
                console.log("function: ", data.function);
                setCode(data.function);
            })
            .catch((error) => {
                console.error("error get function declaration: ", error);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
}

export default CodeEditor;
