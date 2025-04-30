import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./SignIn.css";
import logo from "../../assets/logo.svg";
import apiUrl from "../../config/api";

function SignIn() {
    // user input values
    const [account, setAccount] = useState({
        username: "",
        password: "",
    });

    // errors when user enters
    const [errors, setErrors] = useState({
        username: "",
        password: "",
    });

    const navigate = useNavigate();

    // show password or not
    const [showPassword, setShowPassword] = useState(false);

    // update values when user is typing...
    const handleChange = (e) => {
        const { name, value } = e.target;
        setAccount({ ...account, [name]: value });
    };

    // handle when user clicks show password icon
    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    // clear error when user is typing...
    const handleInput = (e) => {
        const { name } = e.target;
        setErrors({ ...errors, [name]: "" });
    };

    // handle when user clicks Sign in
    const handleSubmit = () => {
        let isValid = true;
        for (let prop in account) {
            if (account[prop] === "") {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [prop]: "Required",
                }));

                isValid = false;
                console.log("Invalid input");
            }
        }
        if (isValid) {
            getStatusSignIn().then((status) => {
                if (status === 404) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        password:
                            "The username and/or password you specified are not correct.",
                    }));
                    console.error("Wrong account!");
                } else if (status === 200) {
                    console.log("Sign in successful!");
                    navigate("/");
                } else console.error("another error!");
            });
        }
    };

    // check account's status when sign in
    const getStatusSignIn = () => {
        return fetch(`${apiUrl}/v1/auth/login`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: account.username,
                password: account.password,
            }),
        })
            .then(async (response) => {
                const status = response.status;
                const data = await response.json();

                console.log("Sign in status: ", status);
                console.log("Login response:", data);

                if (data.accessToken !== undefined) {
                    console.log("accessToken: ", data.accessToken);
                    sessionStorage.setItem("accessToken", data.accessToken);
                    console.log("csrfToken: ", data.csrfToken);
                    sessionStorage.setItem("csrfToken", data.csrfToken);
                }

                return status;
            })
            .catch((error) => console.error("Sign in error: ", error));
    };

    // sign in with github
    const handleSignInWithGithub = () => {
        window.location.href = `${apiUrl}/v1/auth/github`;
    };

    return (
        <div className="signin-box">
            <div className="container">
                <img src={logo} alt="LeetCode Logo" />
                <form action="" className="signup">
                    <input
                        type="text"
                        className="input input-without-icon"
                        name="username"
                        placeholder="Username or E-mail"
                        onChange={handleChange}
                        onInput={handleInput}
                    />
                    <p className="error-message">{errors.username}</p>
                    <label className="input input-with-icon">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            className=""
                            placeholder="Password"
                            onChange={handleChange}
                            onInput={handleInput}
                        />
                        <i
                            className={
                                showPassword
                                    ? "fa-regular fa-eye"
                                    : "fa-regular fa-eye-slash"
                            }
                            onClick={handleShowPassword}
                        />
                    </label>
                    <p className="error-message">{errors.password}</p>
                </form>
                <button className="signup-btn" onClick={handleSubmit}>
                    Sign In
                </button>
                <div className="signup-action">
                    <Link to="/forgot-password">Forgot Password?</Link>{" "}
                    <span>
                        <Link to="/sign-up">Sign Up</Link>
                    </span>
                </div>
                <div className="container-another">
                    <p className="tips">or you can sign in with</p>
                    <div className="another">
                        <i className="fab fa-google" />
                        <i
                            className="fab fa-github"
                            onClick={handleSignInWithGithub}
                        />
                        <i className="fab fa-facebook" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
