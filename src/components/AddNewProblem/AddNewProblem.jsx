import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

import "./AddNewProblem.css";
import Problem from "../Problem/Problem";
import apiUrl from "@/config/api";
import refreshAccessToken from "@/api/refreshAccessToken";

const AddNewProblem = () => {
    const { problemId } = useOutletContext();
    const [newProblem, setNewProblem] = useState({
        title: "",
        description: {
            text: "",
            examples: [],
            constraints: [],
            extra: "",
        },
        difficulty: "",
        tags: [],
    });
    const [template, setTemplate] = useState(null);
    const [language, setLanguage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (problemId) {
            fetch(`${apiUrl}/v1/problems/${problemId}`)
                .then((res) => res.json())
                .then((data) => {
                    setNewProblem(data);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [problemId]);

    const handleChangeInput1 = (e) => {
        setNewProblem({ ...newProblem, [e.target.name]: e.target.value });
    };

    const handleChangeInput2 = (e) => {
        setNewProblem({
            ...newProblem,
            description: {
                ...newProblem.description,
                [e.target.name]: e.target.value,
            },
        });
    };

    const handleChangeInputWithArray1 = (e, index) => {
        const name = e.target.name;
        setNewProblem((prev) => {
            const newArray = [...prev[name]];
            newArray[index] = e.target.value;
            return {
                ...prev,
                [name]: newArray,
            };
        });
    };

    const handleChangeInputWithArray2 = (e, index) => {
        const name = e.target.name;
        setNewProblem((prev) => {
            const newArray = [...prev.description[name]];
            newArray[index] = e.target.value;
            return {
                ...prev,
                description: {
                    ...prev.description,
                    [name]: newArray,
                },
            };
        });
    };

    const handleChangeInputWithArray3 = (e, index) => {
        const name = e.target.name;
        setNewProblem((prev) => {
            const newArray = [...prev.description.examples];
            newArray[index][name] = e.target.value;
            return {
                ...prev,
                description: {
                    ...prev.description,
                    examples: newArray,
                },
            };
        });
    };

    const handleDeleteElement1 = (prop, index) => {
        const newArray = [...newProblem[prop]];
        newArray.splice(index, 1);
        setNewProblem({ ...newProblem, [prop]: newArray });
    };

    const handleDeleteElement2 = (prop, index) => {
        const newArray = [...newProblem.description[prop]];
        newArray.splice(index, 1);
        setNewProblem({
            ...newProblem,
            description: { ...newProblem.description, [prop]: newArray },
        });
    };

    const handleClickAddNewElement1 = (prop, newElement) => {
        setNewProblem((prev) => ({
            ...prev,
            [prop]: [...prev[prop], newElement],
        }));
    };

    const handleClickAddNewElement2 = (prop, newElement) => {
        setNewProblem((prev) => ({
            ...prev,
            description: {
                ...prev.description,
                [prop]: [...prev.description[prop], newElement],
            },
        }));
    };

    const handlePostProblem = async () => {
        const csrfToken = sessionStorage.getItem("csrfToken");

        const sendRequest = async (token) => {
            return await fetch(`${apiUrl}/v1/problems`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "X-CSRF-Token": csrfToken,
                },
                body: JSON.stringify(newProblem),
            });
        };

        try {
            let accessToken = sessionStorage.getItem("accessToken");
            if (accessToken && jwtDecode(accessToken).role === "ADMIN") {
                let res = await sendRequest(accessToken);

                if (res.status === 401) {
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

                if (res.status === 201) {
                    toast.success("Changes have been saved.", {
                        autoClose: 3000,
                    });
                    navigate("/admin/problems");
                } else if (res.action === 400) {
                    toast.error("Some required fields are missing.", {
                        autoClose: 3000,
                    });
                } else {
                    toast.error("Unexpected error. Please try again.", {
                        autoClose: 3000,
                    });
                }
            } else
                toast.error(
                    "Access denied. You are not authorized to perform this operation.",
                    {
                        autoClose: 3000,
                    }
                );
        } catch (error) {
            console.error("add new problem error: ", error);
        }
    };

    return (
        <div className="add-problem-container">
            <div>
                <div className="create-problem scrollable">
                    <div className="label-input">
                        <span>Title:</span>
                        <input
                            name="title"
                            type="text"
                            placeholder="Title here"
                            value={newProblem.title}
                            onChange={handleChangeInput1}
                        />
                    </div>
                    <div className="row-label-input">
                        <div className="label-input">
                            <span>Difficulty:</span>
                            <select
                                name="difficulty"
                                value={newProblem.difficulty}
                                onChange={handleChangeInput1}
                            >
                                <option value="" disabled>
                                    Select difficulty
                                </option>
                                <option value="EASY">Easy</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HARD">Hard</option>
                            </select>
                        </div>
                        <div className="label-input">
                            <span>Tags:</span>
                            <div className="tags add-tags">
                                {newProblem.tags?.map((tag, index) => {
                                    return (
                                        <span key={index} className="admin-tag">
                                            <input
                                                name="tags"
                                                type="text"
                                                value={tag}
                                                onChange={(e) => {
                                                    handleChangeInputWithArray1(
                                                        e,
                                                        index
                                                    );
                                                }}
                                                placeholder="New Tag"
                                            />
                                            <i
                                                className="fa-solid fa-xmark admin-delete-icon"
                                                onClick={() =>
                                                    handleDeleteElement1(
                                                        "tags",
                                                        index
                                                    )
                                                }
                                            />
                                        </span>
                                    );
                                })}
                                <span
                                    className="add-tag"
                                    onClick={() => {
                                        handleClickAddNewElement1("tags", "");
                                    }}
                                >
                                    {" "}
                                    <i className="fa-solid fa-plus" /> Tag
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="label-input">
                        <span>Description:</span>
                        <textarea
                            name="text"
                            type="text"
                            placeholder="Description here"
                            value={newProblem.description?.text}
                            rows={5}
                            onChange={handleChangeInput2}
                        />
                    </div>
                    <div className="group-example">
                        {newProblem.description?.examples.map(
                            (example, index) => {
                                return (
                                    <div className="new-example" key={index}>
                                        <div>
                                            <span>Example {index + 1}:</span>
                                            <i
                                                className="fa-solid fa-trash admin-delete-icon"
                                                onClick={() => {
                                                    handleDeleteElement2(
                                                        "examples",
                                                        index
                                                    );
                                                }}
                                            />
                                        </div>
                                        <div className="label-input">
                                            <span>Input:</span>
                                            <input
                                                name="input"
                                                type="text"
                                                placeholder="Input here"
                                                value={example.input}
                                                onChange={(e) => {
                                                    handleChangeInputWithArray3(
                                                        e,
                                                        index
                                                    );
                                                }}
                                            />
                                        </div>
                                        <div className="label-input">
                                            <span>Output:</span>
                                            <input
                                                name="output"
                                                type="text"
                                                placeholder="Output here"
                                                value={example.output}
                                                onChange={(e) => {
                                                    handleChangeInputWithArray3(
                                                        e,
                                                        index
                                                    );
                                                }}
                                            />
                                        </div>
                                        <div className="label-input">
                                            <span>Explanation (optional):</span>
                                            <textarea
                                                name="explanation"
                                                type="text"
                                                placeholder="Explanation here"
                                                value={example.explanation}
                                                onChange={(e) => {
                                                    handleChangeInputWithArray3(
                                                        e,
                                                        index
                                                    );
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            }
                        )}
                        <div>
                            <button
                                className="admin-add-btn"
                                onClick={() => {
                                    handleClickAddNewElement2("examples", {
                                        input: "",
                                        output: "",
                                        explanation: "",
                                    });
                                }}
                            >
                                <i className="fa-solid fa-plus" /> Example
                            </button>
                        </div>
                    </div>
                    <div className="group-constraint">
                        <div className="label-input">
                            <span>Constraints:</span>
                            {newProblem.description?.constraints.map(
                                (constraint, index) => {
                                    return (
                                        <div
                                            className="admin-constraint"
                                            key={index}
                                        >
                                            <i
                                                className="fa-solid fa-xmark admin-delete-icon"
                                                onClick={() =>
                                                    handleDeleteElement2(
                                                        "constraints",
                                                        index
                                                    )
                                                }
                                            />
                                            <input
                                                name="constraints"
                                                key={index}
                                                type="text"
                                                value={constraint}
                                                placeholder={`Constraint ${
                                                    index + 1
                                                }`}
                                                onChange={(e) => {
                                                    handleChangeInputWithArray2(
                                                        e,
                                                        index
                                                    );
                                                }}
                                            />
                                        </div>
                                    );
                                }
                            )}
                        </div>
                        <div>
                            <button
                                className="admin-add-btn"
                                onClick={() => {
                                    handleClickAddNewElement2(
                                        "constraints",
                                        ""
                                    );
                                }}
                            >
                                <i className="fa-solid fa-plus" /> Constraint
                            </button>
                        </div>
                    </div>
                    <div className="label-input">
                        <span>Challenge (optional): </span>
                        <textarea
                            type="text"
                            name="extra"
                            placeholder="Challenge"
                            value={newProblem.description?.extra}
                            onChange={handleChangeInput2}
                        />
                    </div>
                    {problemId && (
                        <div className="group-template">
                            <div className="label-input row-label-input">
                                <span>Languages: </span>
                                <div className="tags">
                                    {newProblem?.supports?.map(
                                        (language, index) => (
                                            <span key={index}>{language}</span>
                                        )
                                    )}
                                </div>
                            </div>
                            <div>
                                <select
                                    value={language}
                                    onChange={(e) => {
                                        setLanguage(e.target.value);
                                    }}
                                >
                                    <option value="" disabled>
                                        Select language
                                    </option>
                                    <option value="python">python</option>
                                    <option value="javascript">
                                        javascript
                                    </option>
                                    <option value="cpp">cpp</option>
                                    <option value="java">java</option>
                                </select>
                                <input
                                    type="file"
                                    onChange={(e) => {
                                        setTemplate(e.target.files[0]);
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
                <div className="preview-problem problem-container">
                    <div>
                        <span>Preview</span>
                        <div>
                            <button
                                onClick={() => {
                                    navigate("/admin/problems");
                                }}
                            >
                                Cancel
                            </button>
                            <button onClick={handlePostProblem}>
                                <i className="fa-regular fa-paper-plane" /> Post
                            </button>
                        </div>
                    </div>
                    <Problem problem={newProblem} />
                </div>
            </div>
        </div>
    );
};

export default AddNewProblem;
