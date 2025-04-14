import { useMemo, useState } from "react";
import "./Testcase.css";

function Testcase() {
    const examples = {
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
            {
                input: "nums1 = [0], m = 0, nums2 = [1], n = 1",
                output: "[1]",
                explanation:
                    "The arrays we are merging are [] and [1].\nThe result of the merge is [1].\nNote that because m = 0, there are no elements in nums1.\nThe 0 is only there to ensure the merge result can fit in nums1.",
                _id: "67f9ef27fa439590ee4e02ff",
            },
        ],
    };
    const inputs = useMemo(() => {
        return examples.examples.map((example) => {
            const input = {};
            example.input.split(", ").forEach((pair) => {
                const [key, value] = pair.split("=").map((s) => s.trim());
                input[key] = value;
            });

            return input;
        });
    }, []);
    const [testCase, setTestcase] = useState(1);

    const handleChangeTestCase = (index) => {
        setTestcase(index + 1);
    };

    return (
        <div className="code-editor-container scrollable">
            <div className="testcase-container">
                <div className="tab-cases">
                    {examples.examples.map((example, index) => {
                        return (
                            <div>
                                <button
                                    key={index}
                                    className={
                                        testCase === index + 1
                                            ? "active-testcase"
                                            : ""
                                    }
                                    onClick={() => handleChangeTestCase(index)}
                                >
                                    Case {index + 1}
                                </button>
                            </div>
                        );
                    })}
                </div>
                <div className="body-testcase">
                    {inputs.map((input, index) => {
                        return (
                            <div
                                className={
                                    testCase === index + 1
                                        ? ""
                                        : "hidden-testcase"
                                }
                            >
                                {Object.entries(input).map(([key, value]) => {
                                    return (
                                        <div>
                                            <p>{key} = </p>
                                            <span>{value}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Testcase;
