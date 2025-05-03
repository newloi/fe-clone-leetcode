// import { useEffect, useState } from "react";
import "./Problem.css";
// import apiUrl from "../../config/api";

const Problem = ({ problem }) => {
    return (
        <div className="code-editor-container scrollable">
            <div className="problem-container">
                <div className="title-problem">
                    <h1>{problem?.title}</h1>
                    <div className="tags">
                        <span
                            className={
                                problem?.difficulty === "EASY"
                                    ? "easy-tag"
                                    : problem?.difficulty === "MEDIUM"
                                    ? "medium-tag"
                                    : "hard-tag"
                            }
                        >
                            {problem?.difficulty}
                        </span>
                        {problem?.tags?.map((tag, index) => {
                            return <span key={index}>{tag}</span>;
                        })}
                    </div>
                </div>
                <div className="description">
                    <p className="text">{problem?.description?.text}</p>
                    <br />
                    <br />
                    <div className="examples">
                        {problem?.description?.examples?.map(
                            (example, index) => {
                                return (
                                    <div key={index} className="example">
                                        <strong>Example {index + 1}:</strong>
                                        <pre className="content-example">
                                            <strong>Input:</strong>{" "}
                                            {example.input}
                                            <br />
                                            <strong>Output:</strong>{" "}
                                            {example.output}
                                            <br />
                                            <strong>Explanation:</strong>{" "}
                                            {example.explanation}
                                        </pre>
                                        <br />
                                    </div>
                                );
                            }
                        )}
                    </div>
                    <br />
                    <div className="constraints">
                        <strong>Constraints:</strong>
                        <ul>
                            {problem?.description?.constraints?.map(
                                (constraint, index) => {
                                    return (
                                        <li key={index}>
                                            <code>{constraint}</code>
                                        </li>
                                    );
                                }
                            )}
                        </ul>
                    </div>
                    <br />
                    {problem?.description?.extra && (
                        <div className="follow-up">
                            <strong>Follow up: </strong>{" "}
                            {problem?.description?.extra}
                        </div>
                    )}
                    <br />
                    <br />
                </div>
            </div>
        </div>
    );
};

export default Problem;
