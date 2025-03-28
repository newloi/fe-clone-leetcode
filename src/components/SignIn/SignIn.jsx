import { useState } from "react";

import "./SignIn.css";
import logo from "../../assets/logo.svg";

export function SignIn() {
    const [account, setAccount] = useState({
        username: "",
        password: "",
    });
    const [error, setError] = useState({
        username: "",
        password: "",
    });

    return (
        <div className="signin-box">
            <div className="container">
                <img src={logo} alt="LeetCode Logo" />
                <form action="" className="signup">
                    <input
                        type="text"
                        className="input input-without-icon"
                        placeholder="Username or E-mail"
                    />
                    <div className="error-message-container">
                        <p className="error-message"></p>
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
                        <p className="error-message"></p>
                    </div>
                </form>
                <button className="signup-btn">Sign In</button>
                <div className="signup-action">
                    <a href="">Forgot Password?</a> <span>Sign Up</span>
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

export function PasswordReset() {
    return (
        <form action="" className="reset-form">
            <h3 className="reset-form-heading">Password Reset</h3>
            <hr />
            <p className="message">
                Forgotten your password? Enter your e-mail address below, and
                we'll send you an e-mail allowing you to reset it.
            </p>
            <div className="form-group">
                <input
                    type="email"
                    className="input input-without-icon"
                    placeholder="E-mail address"
                    // style={{ marginBottom: "0" }}
                />
                <div className="input-feedback"></div>
            </div>
            <button className="reset-btn" type="submit">
                Reset My Password
            </button>
        </form>
    );
}
