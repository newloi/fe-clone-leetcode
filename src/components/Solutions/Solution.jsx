import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import "highlight.js/styles/vs2015.css";
import { useEffect, useState } from "react";
import apiUrl from "@/config/api";

const Solution = ({ solutionId, setTab }) => {
    const [solution, setSolution] = useState();

    useEffect(() => {
        fetch(`${apiUrl}/v1/discussions/${solutionId}`)
            .then((res) => res.json())
            .then((data) => {
                setSolution(data);
            })
            .catch((error) => {
                console.error("solution error: ", error);
            });
    }, [solutionId]);

    const date = new Date(solution?.createdAt);
    const dateString = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit",
    });

    const timeString = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    return (
        <div className="solution-container">
            <div className="header-solution">
                <span
                    onClick={() => {
                        setTab("solutions");
                    }}
                >
                    <i className="fa-solid fa-arrow-left" /> All Solutions
                </span>
            </div>
            <div className="body-solution scrollable">
                <p className="title-solution">{solution?.title}</p>
                <div className="author-infor">
                    {solution?.author?.avatar ? (
                        <div className="avatar-frame">
                            <img src={solution?.author?.avatar} />
                        </div>
                    ) : (
                        <i className="fa-regular fa-circle-user" />
                    )}
                    <div>
                        <span>{solution?.author?.name}</span>
                        <span>
                            {dateString}, {timeString}
                        </span>
                    </div>
                </div>
                <div className="tags">
                    {solution?.tags?.map((tag, index) => {
                        return <span key={index}>{tag}</span>;
                    })}
                </div>
                <div className="content-solution">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw, rehypeHighlight]}
                    >
                        {solution?.content}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
};

export default Solution;
