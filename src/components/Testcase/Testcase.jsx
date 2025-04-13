import "./Testcase.css";

function Testcase() {
    let example = {
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
    };
    return <div className="code-editor-container scrollable"></div>;
}

export default Testcase;
