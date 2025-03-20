import "./SignUp.css";
import logo from "../assets/logo.svg";

function SignUp() {
    return (
        <div className="signin-box">
            <div className="container">
                <img src={logo} alt="LeetCode Logo" />
                <form action="" className="signup">
                    <input
                        type="text"
                        className="input input-without-icon"
                        placeholder="Username"
                    />
                    <div className="error-message-container">
                        <p className="error-message">Content is too short</p>
                    </div>
                    <label className="input input-with-icon">
                        <input
                            type="password"
                            className=""
                            placeholder="Password"
                        />
                        <i className="fa-regular fa-eye-slash" />
                    </label>
                    <div className="error-message-container">
                        <p className="error-message">
                            Must be at least 8 characters with letter and
                            number, no special or non-ASCII characters.
                        </p>
                    </div>
                    <label className="input input-with-icon">
                        <input
                            type="password"
                            className=""
                            placeholder="Confirm password"
                        />
                        <i className="fa-regular fa-eye-slash" />
                    </label>
                    <div className="error-message-container">
                        <p className="error-message">
                            Please enter your password again
                        </p>
                    </div>
                    <input
                        type="email"
                        className="input input-without-icon"
                        placeholder="E-mail address"
                    />
                    <div className="error-message-container">
                        <p className="error-message">Required</p>
                    </div>
                </form>
                <button className="signup-btn">Sign Up</button>
                <div className="action">
                    Have an account?{" "}
                    <span className="signin-action">Sign In</span>
                </div>
                <div className="container-another">
                    <p className="tips">or you can sign in with</p>
                    <div className="another">
                        <i className="fab fa-google" />
                        <i className="fab fa-github" />
                        <i className="fab fa-facebook" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
