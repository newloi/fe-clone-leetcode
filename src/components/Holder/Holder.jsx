import { useNavigate } from "react-router-dom";

import "./Holder.css";

const Holder = () => {
    const navigate = useNavigate();

    return (
        <div className="holder-container">
            <h4>🔥 LeetBase – Build your base, level up your code!</h4>
            <span>View your Submission records here</span>
            <button
                onClick={() => {
                    navigate("/sign-in");
                }}
            >
                Register or Sign In
            </button>
        </div>
    );
};

export default Holder;
