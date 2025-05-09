import "./Holder.css";

const Holder = ({ actionText, action }) => {
    return (
        <div className="holder-container">
            <h4>🔥 LeetBase – Build your base, level up your code!</h4>
            <span>View your Submission records here</span>
            <button onClick={action}>{actionText}</button>
        </div>
    );
};

export default Holder;
