import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import MDEditor from "@uiw/react-md-editor/nohighlight";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";

import HeaderHome from "../../components/Header/HeaderHome";
import "./PostSolution.css";
import apiUrl from "../../config/api";
import refreshAccessToken from "../../api/refreshAccessToken";

const PostSolution = () => {
    const { resultId } = useParams();
    const navigate = useNavigate();
    const [result, setResult] = useState();
    const [tags, setTags] = useState([]);
    const [title, setTitle] = useState("");
    useEffect(() => {
        const getResult = async () => {
            const sendRequest = async (token) => {
                return await fetch(`${apiUrl}/v1/submissions/${resultId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
            };

            try {
                let accessToken = sessionStorage.getItem("accessToken");
                let res = await sendRequest(accessToken);

                if (res.status === 401) {
                    console.warn("Token expired, attempting to refresh...");

                    const refreshed = await refreshAccessToken();
                    if (!refreshed) {
                        toast.error(
                            "Your session has expired. Please log in again.",
                            { autoClose: 3000 }
                        );
                        navigate("/sign-in");
                        return;
                    }

                    accessToken = sessionStorage.getItem("accessToken");
                    res = await sendRequest(accessToken);
                }

                const data = await res.json();
                setResult(data);
            } catch (error) {
                console.error("get result error: ", error);
            }
        };

        if (resultId) {
            getResult();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resultId]);

    const [markdown, setMarkdown] = useState();
    useEffect(() => {
        if (result) {
            const markdownTemplate = `# Intuition
<!-- Describe your first thoughts on how to solve this problem. -->
    
# Approach
<!-- Describe your approach to solving the problem. -->
    
# Complexity
- Time complexity:
<!-- Add your time complexity here, e.g. $$O(n)$$ -->
    
- Space complexity:
<!-- Add your space complexity here, e.g. $$O(n)$$ -->
    
# Code
\`\`\`${result.language}
${result.code}
\`\`\``;

            setMarkdown(markdownTemplate);
            // setTags([
            //     `${
            //         result.language === "javascript"
            //             ? "JavaScript"
            //             : result.language === "python"
            //             ? "Python"
            //             : result.language === "cpp"
            //             ? "C++"
            //             : "Java"
            //     }`,
            // ]);
        }
    }, [result]);

    useEffect(() => {
        if (result) {
            fetch(`${apiUrl}/v1/problems/${result?.problem}`)
                .then((res) => res.json())
                .then((data) => {
                    data.tags.unshift(
                        `${
                            result.language === "javascript"
                                ? "JavaScript"
                                : result.language === "python"
                                ? "Python"
                                : result.language === "cpp"
                                ? "C++"
                                : "Java"
                        }`
                    );
                    setTags(data.tags);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [result]);

    const handlePostSolution = async () => {
        if (title) {
            const csrfToken = sessionStorage.getItem("csrfToken");

            const sendRequest = async (token) => {
                return await fetch(`${apiUrl}/v1/discussions`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "X-CSRF-Token": csrfToken,
                    },
                    body: JSON.stringify({
                        title: title,
                        content: markdown,
                        tags: tags,
                        solution: {
                            problem: result.problem,
                            language: result.language,
                        },
                    }),
                });
            };

            try {
                let accessToken = sessionStorage.getItem("accessToken");
                let res = await sendRequest(accessToken);

                if (res.status === 401) {
                    console.warn("Token expired, attempting to refresh...");

                    const refreshed = await refreshAccessToken();
                    if (!refreshed) {
                        toast.error(
                            "Your session has expired. Please log in again.",
                            { autoClose: 3000 }
                        );
                        navigate("/sign-in");
                        return;
                    }

                    accessToken = sessionStorage.getItem("accessToken");
                    res = await sendRequest(accessToken);
                }
            } catch (error) {
                console.error("post solution error: ", error);
            }

            navigate(-1);
        }
    };

    return (
        <div className="container-post">
            <HeaderHome />
            <div className="background-post">
                <div className="post">
                    <div className="header-post">
                        <div>
                            <input
                                type="text"
                                className="title-post"
                                placeholder="Enter your title"
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                }}
                            />
                            <button
                                onClick={() => {
                                    navigate(-1);
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePostSolution}
                                className={title ? "" : "disable-btn"}
                            >
                                <i className="fa-regular fa-paper-plane" /> Post
                            </button>
                        </div>
                        <div className="tags">
                            {tags?.map((tag, index) => {
                                return <span key={index}>{tag}</span>;
                            })}
                        </div>
                    </div>
                    <div className="body-post">
                        <MDEditor
                            value={markdown}
                            onChange={setMarkdown}
                            previewOptions={{
                                rehypePlugins: [[rehypeHighlight]],
                            }}
                            height="100%"
                        />
                        {/* <MDEditor.Markdown
                            source={markdown}
                            style={{ whiteSpace: "pre-wrap" }}
                        /> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostSolution;
