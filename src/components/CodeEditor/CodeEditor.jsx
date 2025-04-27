import Editor from "@monaco-editor/react";
import "./CodeEditor.css";
import { useEffect, useState } from "react";
import apiUrl from "../../config/api";

function CodeEditor({ problemId }) {
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("javascript");
    const handleChangeLanguage = (e) => {
        setLanguage(e.target.value);
        console.log(code);
    };

    useEffect(() => {
        fetch(
            `${apiUrl}/v1/problems/${problemId}/functions?language=${language}`
        )
            .then((res) => res.json())
            .then((data) => {
                setCode(data.function);
            })
            .catch((error) => {
                console.error("error get function declaration: ", error);
            });
    }, [language, problemId]);

    return (
        <div className="code-editor-container" style={{ padding: 0 }}>
            <div className="language-selected-container">
                <select
                    className="language-selected"
                    onChange={handleChangeLanguage}
                >
                    <option value="javascript">JavaScript</option>
                    <option value="cpp">C++</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                </select>
            </div>
            {/* <hr className="light-line" /> */}
            <Editor
                height="100%"
                defaultLanguage="cpp"
                defaultValue={code}
                theme="vs-dark"
            />
        </div>
    );
}

export default CodeEditor;
