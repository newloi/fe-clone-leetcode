import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./SignUp.css";
import logo from "../../assets/logo.svg";
import apiUrl from "../../config/api";

function SignUp() {
    const passwordRegex = /^[A-Za-z0-9]{8,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // user input values
    const [account, setAccount] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
    });

    // errors when user enters
    const [errors, setErrors] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
    });

    // show password or not
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    // update account when user is typing...
    const handleChange = (e) => {
        const { name, value } = e.target;
        setAccount({ ...account, [name]: value });
    };

    //handle when user finishes a field
    const handleInvalidation = (e) => {
        const { name, value } = e.target;
        if (value.trim() === "") {
            setErrors({ ...errors, [name]: "Required" });
            return;
        }
        switch (name) {
            case "username":
                if (value.length < 3) {
                    setErrors({ ...errors, [name]: "Username is too short." });
                }
                break;
            case "password":
                if (!passwordRegex.test(value)) {
                    setErrors({
                        ...errors,
                        [name]: "Must be at least 8 characters with letter and number, no special or non-ASCII characters.",
                    });
                }
                break;
            case "confirmPassword":
                if (value !== account.password) {
                    setErrors({
                        ...errors,
                        [name]: "The passwords you entered do not match.",
                    });
                }
                break;
            case "email":
                if (!emailRegex.test(value)) {
                    setErrors({
                        ...errors,
                        [name]: "Invalid email address.",
                    });
                }
                break;
            default:
                break;
        }
    };

    // clear error when user is typing...
    const handleInput = (e) => {
        const { name } = e.target;
        setErrors({ ...errors, [name]: "" });
    };

    // handle when user clicks show password icon
    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    // validating submission when user clicks Sign Up button
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
            getStatusSignUp().then((status) => {
                if (status === 409) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        username: "Username is used",
                    }));
                    console.error("username is used!");
                } else if (status === 418) {
                    setErrors((prevState) => ({
                        ...prevState,
                        email: "Email is used",
                    }));
                } else if (status === 201) {
                    navigate(`/sign-up/verify-email/${account.email}`);
                    console.log("account is created");
                } else console.error("another error!");
            });
        }
    };

    // check account's status when sign up
    const getStatusSignUp = () => {
        return fetch(`${apiUrl}/v1/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: account.username,
                password: account.password,
                email: account.email,
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
                }

                return status;
            })
            .catch((error) => console.error("Sign up error: ", error));
    };

    // sign in with github
    const handleSignInWithGithub = () => {
        window.location.href = `${apiUrl}/v1/auth/github`;
    };

    return (
        <div className="signin-box">
            <div className="container">
                <img src={logo} alt="LeetCode Logo" />
                <form className="signup">
                    <input
                        type="text"
                        className="input input-without-icon"
                        name="username"
                        placeholder="Username"
                        onChange={handleChange}
                        onBlur={handleInvalidation}
                        onInput={handleInput}
                    />
                    <p className="error-message">{errors.username}</p>
                    <label className="input input-with-icon">
                        <input
                            type={showPassword ? "text" : "password"}
                            className=""
                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                            onBlur={handleInvalidation}
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
                    <label className="input input-with-icon">
                        <input
                            type={showPassword ? "text" : "password"}
                            className=""
                            name="confirmPassword"
                            placeholder="Confirm password"
                            onChange={handleChange}
                            onBlur={handleInvalidation}
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
                    <p className="error-message">{errors.confirmPassword}</p>
                    <input
                        type="email"
                        className="input input-without-icon"
                        name="email"
                        placeholder="E-mail address"
                        onChange={handleChange}
                        onBlur={handleInvalidation}
                        onInput={handleInput}
                    />
                    <p className="error-message">{errors.email}</p>
                </form>
                <button className="signup-btn" onClick={handleSubmit}>
                    Sign Up
                </button>
                <div className="signin-action">
                    Have an account?{" "}
                    <span>
                        <Link to="/">Sign In</Link>
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

export default SignUp;
