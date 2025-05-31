import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import MDEditor from "@uiw/react-md-editor/nohighlight";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";
import HashLoader from "react-spinners/HashLoader";

import HeaderHome from "../../components/Header/HeaderHome";
import "./PostSolution.css";
import apiUrl from "../../config/api";
import refreshAccessToken from "../../api/refreshAccessToken";

const PostSolution = () => {
    const { resultId, solutionId } = useParams();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [solution, setSolution] = useState(null);
    const [tags, setTags] = useState([]);
    const [title, setTitle] = useState("");
    const [oldTitle, setOldTitle] = useState(null);
    const [markdown, setMarkdown] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const getResult = async () => {
            setIsLoading(true);
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
            } finally {
                setIsLoading(false);
            }
        };

        const getSolution = async () => {
            setIsLoading(true);
            const sendRequest = async () => {
                return await fetch(`${apiUrl}/v1/discussions/${solutionId}`);
            };

            try {
                const res = await sendRequest();
                const data = await res.json();
                setSolution(data);
                setTags(data.tags);
                setTitle(data.title);
                setOldTitle(data.title);
            } catch (error) {
                console.error("get solution error: ", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (resultId) {
            getResult();
        } else if (solutionId) getSolution();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resultId, solutionId]);

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
        } else if (solution) setMarkdown(solution.content);
    }, [result, solution]);

    useEffect(() => {
        if (result) {
            setIsLoading(true);
            fetch(`${apiUrl}/v1/problems/${result?.problem}`)
                .then((res) => res.json())
                .then((data) => {
                    data.tags.unshift(
                        `${result.language === "javascript"
                            ? "JavaScript"
                            : result.language === "python"
                                ? "Python"
                                : result.language === "cpp"
                                    ? "C++"
                                    : "Java"
                        }`
                    );
                    setTags(data.tags);
                    // console.log(data.tags);
                })
                .catch((error) => {
                    console.error(error);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [result]);

    const handlePostSolution = async () => {
        if (title) {
            setIsLoading(true);
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

            const sendUpdateRequest = async (token) => {
                return await fetch(`${apiUrl}/v1/discussions/${solutionId}`, {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "X-CSRF-Token": csrfToken,
                    },
                    body: JSON.stringify({
                        ...(title !== oldTitle && { title: title }),
                        content: markdown,
                    }),
                });
            };

            try {
                let accessToken = sessionStorage.getItem("accessToken");
                let res;
                if (solutionId) {
                    res = await sendUpdateRequest(accessToken);
                } else res = await sendRequest(accessToken);

                if (res.status === 401) {
                    console.warn("Token expired, attempting to refresh...");

                    const refreshed = await refreshAccessToken();
                    if (!refreshed) {
                        toast.error(
                            "Your session has expired. Please log in again.",
                            { autoClose: 3000 }
                        );
                        sessionStorage.setItem("lastVisit", location.pathname);
                        navigate("/sign-in");
                        return;
                    }

                    accessToken = sessionStorage.getItem("accessToken");
                    if (solutionId) {
                        res = await sendUpdateRequest(accessToken);
                    } else res = await sendRequest(accessToken);
                }
            } catch (error) {
                console.error("post solution error: ", error);
            } finally {
                setIsLoading(false);
                navigate(`${sessionStorage.getItem("lastVisit") || -1}`);
            }
        }
    };

    return (
        <>
            <div
                className={`dark-overlay overlay overall-overlay ${isLoading ? "" : "hidden"
                    }`}
            >
                <HashLoader color="#36d7b7" loading={isLoading} size={35} />
            </div>
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
                                        navigate(
                                            `${sessionStorage.getItem(
                                                "lastVisit"
                                            ) || -1
                                            }`
                                        );
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handlePostSolution}
                                    className={title ? "" : "disable-btn"}
                                >
                                    <i className="fa-regular fa-paper-plane" />{" "}
                                    Post
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
        </>
    );
};

export default PostSolution;
