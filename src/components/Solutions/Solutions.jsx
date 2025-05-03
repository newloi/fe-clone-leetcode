import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import "./Solutions.css";
import apiUrl from "../../config/api";

const Solutions = ({ setTabSolution, setSolutionId }) => {
  const [solutions, setSolutions] = useState();

  useEffect(() => {
    // Gọi /v1/problems/{id}/solutions mới lấy được cho riêng bài tập đó. Ngoài ra thêm ?language để lấy theo ngôn ngữ lập trình
    fetch(`${apiUrl}/v1/discussions/`)
      .then((res) => res.json())
      .then((data) => {
        setSolutions(data.data);
      })
      .catch((error) => {
        console.error("get solutions error: ", error);
      });
  }, []);

  return (
    <div className="code-editor-container">
      <div className="seacrh-group"></div>
      <div className="body-solutions">
        {solutions?.map((solution, index) => {
          const updatedAt = formatDistanceToNow(
            new Date(solution.updatedAt),
            { addSuffix: true }
          );
          return (
            <div
              className="solution-card"
              key={index}
              onClick={() => {
                setSolutionId(solution._id);
                setTabSolution("solution");
              }}
            >
              <div className="avatar">
                <i className="fa-regular fa-circle-user big-icon" />
              </div>
              <div className="body-card">
                <span className="infor">
                  {solution.author?.name || "Anonymous"} •
                  {"  "}
                  {solution.isClosed
                    ? "Closed"
                    : "Open"} • {updatedAt}
                </span>
                <span className="title-solutions">
                  {solution.title}
                </span>
                <div className="tags">
                  {solution.solution?.language && (
                    <span>
                      {solution.solution?.language ===
                        "javascript"
                        ? "JavaScript"
                        : solution.solution
                          ?.language === "python"
                          ? "Python"
                          : solution.solution
                            ?.language === "cpp"
                            ? "C++"
                            : "Java"}
                    </span>
                  )}
                  {solution.tags.map((tag, index) => {
                    return <span key={index}>{tag}</span>;
                  })}
                </div>
                <div className="reactions">
                  <span>
                    <i class="fa-regular fa-thumbs-up" />{" "}
                    {solution.upvotes}
                  </span>
                  <span>
                    <i class="fa-regular fa-thumbs-down" />{" "}
                    {solution.downvotes}
                  </span>
                  <span>
                    <i class="fa-regular fa-comment" />{" "}
                    {solution.comments.length}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Solutions;
