import Split from "react-split";
import CodeEditor from "../../components/CodeEditor/CodeEditor";
import Problem from "../../components/Problem/Problem";
import Output from "../../components/Output/Output";
import "./WorkSpace.css";

function WorkSpace() {
    return (
        <Split className="split">
            <div className="left-side">
                <Problem />
            </div>
            <div className="right-side">
                <Split
                    className="split-vertical"
                    direction="vertical"
                    sizes={[65, 35]}
                >
                    <div className="top-side">
                        <CodeEditor />
                    </div>
                    <div className="bottom-side">
                        <Output />
                    </div>
                </Split>
            </div>
        </Split>
    );
}

export default WorkSpace;
