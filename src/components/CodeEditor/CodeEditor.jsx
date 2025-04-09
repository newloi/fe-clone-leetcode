import Editor from "@monaco-editor/react";
import "./CodeEditor.css";

function CodeEditor() {
    // const handleChange = () => {};

    return (
        <div className="code-editor-container">
            <div className="tabbar">Code</div>
            <div className="language-selected-container">
                <select className="language-selected">
                    <option value="cpp">C++</option>
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                </select>
            </div>
            {/* <hr className="light-line" /> */}
            <Editor
                height="100%"
                defaultLanguage="cpp"
                defaultValue=""
                theme="vs-dark"
            />
        </div>
    );
}

export default CodeEditor;
