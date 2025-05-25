import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import "highlight.js/styles/vs2015.css";
import PulseLoader from "react-spinners/PulseLoader";
// import { useEffect, useState } from "react";

import "./Problem.css";
// import apiUrl from "../../config/api";

const Problem = ({ problem, isLoading }) => {
    return (
        <>
            <div className="code-editor-container scrollable">
                <div
                    className={`page-loader ${
                        isLoading || !problem ? "" : "hidden"
                    }`}
                >
                    <PulseLoader
                        color="#ffffff99"
                        loading={isLoading || !problem}
                        size={10}
                    />
                </div>
                {problem && (
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
                            {/* <p className="text">{problem?.description?.text}</p> */}
                            <div className="text">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeRaw, rehypeHighlight]}
                                >
                                    {problem?.description?.text}
                                </ReactMarkdown>
                            </div>
                            <br />
                            <br />
                            <div className="examples">
                                {problem?.description?.examples?.map(
                                    (example, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className="example"
                                            >
                                                <strong>
                                                    Example {index + 1}:
                                                </strong>
                                                <pre className="content-example">
                                                    <strong>Input:</strong>{" "}
                                                    {example.input}
                                                    <br />
                                                    <strong>
                                                        Output:
                                                    </strong>{" "}
                                                    {example.output}
                                                    <br />
                                                    {example.explanation && (
                                                        <>
                                                            <strong>
                                                                Explanation:
                                                            </strong>{" "}
                                                            {
                                                                example.explanation
                                                            }
                                                        </>
                                                    )}
                                                </pre>
                                                <br />
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                            <br />
                            <div className="constraints text">
                                {problem?.description?.constraints.length !==
                                    0 && <strong>Constraints:</strong>}

                                {problem?.description?.constraints?.map(
                                    (constraint, index) => {
                                        return (
                                            <ReactMarkdown
                                                key={index}
                                                remarkPlugins={[remarkGfm]}
                                                rehypePlugins={[
                                                    rehypeRaw,
                                                    rehypeHighlight,
                                                ]}
                                            >
                                                {constraint}
                                            </ReactMarkdown>
                                        );
                                    }
                                )}
                            </div>

                            {problem?.description?.extra && (
                                <>
                                    <br />
                                    <br />
                                    <div className="follow-up text">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            rehypePlugins={[
                                                rehypeRaw,
                                                rehypeHighlight,
                                            ]}
                                        >
                                            {`**Follow up:** ${problem?.description?.extra}`}
                                        </ReactMarkdown>
                                    </div>
                                </>
                            )}
                            <br />
                            <br />
                        </div>
                    </div>
                )}
                <br />
            </div>
        </>
    );
};

export default Problem;
