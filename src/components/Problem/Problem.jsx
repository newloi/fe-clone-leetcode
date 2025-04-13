import "./Problem.css";

function Problem() {
    let problem = {
        description: {
            text: "You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of elements in nums1 and nums2 respectively.\n\nMerge nums1 and nums2 into a single array sorted in non-decreasing order.\n\nThe final sorted array should not be returned by the function, but instead be stored inside the array nums1. To accommodate this, nums1 has a length of m + n, where the first m elements denote the elements that should be merged, and the last n elements are set to 0 and should be ignored. nums2 has a length of n.",
            examples: [
                {
                    input: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3",
                    output: "[1,2,2,3,5,6]",
                    explanation:
                        "The arrays we are merging are [1,2,3] and [2,5,6]. The result of the merge is [1,2,2,3,5,6] with the underlined elements coming from nums1.",
                    _id: "67f9ef27fa439590ee4e02fd",
                },
                {
                    input: "nums1 = [1], m = 1, nums2 = [], n = 0",
                    output: "[1]",
                    explanation:
                        "The arrays we are merging are [1] and []. The result of the merge is [1].",
                    _id: "67f9ef27fa439590ee4e02fe",
                },
                {
                    input: "nums1 = [0], m = 0, nums2 = [1], n = 1",
                    output: "[1]",
                    explanation:
                        "The arrays we are merging are [] and [1].\nThe result of the merge is [1].\nNote that because m = 0, there are no elements in nums1.\nThe 0 is only there to ensure the merge result can fit in nums1.",
                    _id: "67f9ef27fa439590ee4e02ff",
                },
            ],
            constraints: [
                "nums1.length == m + n",
                "nums2.length == n",
                "0 <= m, n <= 200",
                "1 <= m + n <= 200",
                "-10^9 <= nums1[i], nums2[j] <= 10^9",
            ],
            extra: "Follow up: Can you come up with an algorithm that runs in O(m + n) time?",
        },
        _id: "67f9ef27fa439590ee4e02fc",
        title: "Remove Element",
        difficulty: "EASY",
        tags: ["Array", "Two Pointers"],
        __v: 0,
    };
    return (
        <div className="code-editor-container scrollable">
            <div className="problem-container">
                <div className="title-problem">
                    <h1>{problem.title}</h1>
                    <div className="tags">
                        <span
                            className={
                                problem.difficulty === "EASY"
                                    ? "easy-tag"
                                    : problem.difficulty === "MEDIUM"
                                    ? "medium-tag"
                                    : "hard-tag"
                            }
                        >
                            {problem.difficulty}
                        </span>
                        {problem.tags.map((tag, index) => {
                            return <span key={index}>{tag}</span>;
                        })}
                    </div>
                </div>
                <div className="description">
                    <p className="text">{problem.description.text}</p>
                    <br />
                    <br />
                    <div className="examples">
                        {problem.description.examples.map((example, index) => {
                            return (
                                <div key={index} className="example">
                                    <strong>Example {index + 1}:</strong>
                                    <pre className="content-example">
                                        <strong>Input:</strong> {example.input}
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
                        })}
                    </div>
                    <br />
                    <div className="constraints">
                        <strong>Constraints:</strong>
                        <ul>
                            {problem.description.constraints.map(
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
                    <div className="follow-up">
                        <strong>Follow up: </strong> {problem.description.extra}
                    </div>

                    <br />
                    <br />
                </div>
            </div>
        </div>
    );
}

export default Problem;
