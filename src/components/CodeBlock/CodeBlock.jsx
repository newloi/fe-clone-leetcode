// // import React from 'react';
// import CodeMirror from "@uiw/react-codemirror";
// // import { javascript } from "@codemirror/lang-javascript"; // Mode cho JavaScript
// // import { material } from "@uiw/codemirror-theme-material"; // Theme

// const CodeBlock = ({ language, code }) => {
//     // Ánh xạ ngôn ngữ
//     const normalizedLanguage =
//         language.toLowerCase() === "js" ? "javascript" : language.toLowerCase();

//     // Chọn extension dựa trên ngôn ngữ
//     const extensions =
//         normalizedLanguage === "javascript" ? [javascript()] : [];

//     // Kiểm tra nếu code rỗng
//     if (!code) {
//         return <div>Không có code để hiển thị</div>;
//     }

//     return (
//         <div style={{ height: "500px", overflow: "auto" }}>
//             <CodeMirror
//                 value={code}
//                 height="500px"
//                 extensions={extensions}
//                 theme={material}
//                 basicSetup={{
//                     lineNumbers: false, // Tắt số dòng
//                     highlightActiveLine: false, // Tắt highlight dòng hiện tại
//                     highlightActiveLineGutter: false,
//                 }}
//                 editable={false} // Chế độ chỉ đọc
//                 style={{
//                     userSelect: "none", // Ngăn chọn văn bản
//                     MozUserSelect: "none",
//                     WebkitUserSelect: "none",
//                     msUserSelect: "none",
//                 }}
//             />
//         </div>
//     );
// };

// export default CodeBlock;
