import { useMemo, useState } from "react";
import PulseLoader from "react-spinners/PulseLoader";

import "./Testcase.css";

const Testcase = ({ examples, isLoading }) => {
    const inputs = useMemo(() => {
        return examples?.map((example) => {
            const input = {};
            example.input.split(", ").forEach((pair) => {
                const [key, value] = pair.split("=").map((s) => s.trim());
                input[key] = value;
            });

            return input;
        });
    }, [examples]);
    const [testCase, setTestcase] = useState(1);

    const handleChangeTestCase = (index) => {
        setTestcase(index + 1);
    };

    return (
        <div className="code-editor-container scrollable">
            <div
                className={`page-loader ${
                    isLoading || !examples ? "" : "hidden"
                }`}
            >
                <PulseLoader
                    color="#ffffff99"
                    loading={isLoading || !examples}
                    size={10}
                />
            </div>
            {examples && (
                <div className="testcase-container">
                    <div className="tab-cases">
                        {examples?.map((example, index) => {
                            return (
                                <div key={index}>
                                    <button
                                        key={index}
                                        className={
                                            testCase === index + 1
                                                ? "active-testcase"
                                                : ""
                                        }
                                        onClick={() =>
                                            handleChangeTestCase(index)
                                        }
                                    >
                                        Case {index + 1}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                    <div className="body-testcase">
                        {inputs?.map((input, index) => {
                            return (
                                <div
                                    key={index}
                                    className={
                                        testCase === index + 1 ? "" : "hidden"
                                    }
                                >
                                    {Object.entries(input).map(
                                        ([key, value], index) => {
                                            return (
                                                <div key={index}>
                                                    <p>{key} = </p>
                                                    <pre>{value}</pre>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Testcase;
