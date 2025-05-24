import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";
import { toast } from "react-toastify";

import { handleEnter } from "../SignIn/SignIn";
import "./SignUp.css";
import logo from "@/assets/logo.svg";
import apiUrl from "@/config/api";

const SignUp = () => {
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
    const [isLoading, setIsLoading] = useState(false);

    const inputUsername = useRef(null);
    const inputPassword = useRef(null);
    const inputConfirmPassword = useRef(null);
    const inputEmail = useRef(null);

    useEffect(() => {
        inputUsername.current?.focus();
    }, []);

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
    const handleSubmit = async () => {
        setIsLoading(true);
        const SignUpRequest = async () => {
            return await fetch(`${apiUrl}/v1/auth/register`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: account.username,
                    password: account.password,
                    email: account.email,
                }),
            });
        };

        try {
            let isValid = true;
            for (let prop in account) {
                if (account[prop] === "") {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        [prop]: "Required",
                    }));

                    isValid = false;
                }
            }
            if (isValid) {
                const res = await SignUpRequest();
                if (res.status === 201) {
                    const data = await res.json();
                    sessionStorage.setItem("accessToken", data.accessToken);
                    sessionStorage.setItem("csrfToken", data.csrfToken);
                    navigate(`/sign-up/verify-email/${account.email}`);
                } else if (res.status === 409) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        username: "Username is used",
                    }));
                } else if (res.status === 418) {
                    setErrors((prevState) => ({
                        ...prevState,
                        email: "Email is used",
                    }));
                } else {
                    toast.error("Unexpected error. Please try again.", {
                        autoClose: 3000,
                    });
                }
            }
        } catch (e) {
            console.error("Sign up error: ", e);
        } finally {
            setIsLoading(false);
        }
    };

    // sign in with github
    const handleSignInWithGithub = () => {
        window.location.href = `${apiUrl}/v1/auth/github`;
    };

    return (
        <>
            <div
                className={`dark-overlay overlay overall-overlay ${
                    isLoading ? "" : "hidden"
                }`}
            >
                <HashLoader color="#36d7b7" loading={isLoading} size={35} />
            </div>
            <div className="signin-box">
                <div className="container">
                    <img src={logo} alt="LeetCode Logo" />
                    <form className="signup">
                        <input
                            ref={inputUsername}
                            type="text"
                            className="input input-without-icon"
                            name="username"
                            placeholder="Username"
                            onChange={handleChange}
                            onBlur={handleInvalidation}
                            onInput={handleInput}
                            onKeyDown={(e) => {
                                handleEnter(
                                    e,
                                    handleSubmit,
                                    inputPassword,
                                    account
                                );
                            }}
                        />
                        <p className="error-message">{errors.username}</p>
                        <label className="input input-with-icon">
                            <input
                                ref={inputPassword}
                                type={showPassword ? "text" : "password"}
                                className=""
                                name="password"
                                placeholder="Password"
                                onChange={handleChange}
                                onBlur={handleInvalidation}
                                onInput={handleInput}
                                onKeyDown={(e) => {
                                    handleEnter(
                                        e,
                                        handleSubmit,
                                        inputConfirmPassword,
                                        account
                                    );
                                }}
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
                                ref={inputConfirmPassword}
                                type={showPassword ? "text" : "password"}
                                className=""
                                name="confirmPassword"
                                placeholder="Confirm password"
                                onChange={handleChange}
                                onBlur={handleInvalidation}
                                onInput={handleInput}
                                onKeyDown={(e) => {
                                    handleEnter(
                                        e,
                                        handleSubmit,
                                        inputEmail,
                                        account
                                    );
                                }}
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
                        <p className="error-message">
                            {errors.confirmPassword}
                        </p>
                        <input
                            ref={inputEmail}
                            type="email"
                            className="input input-without-icon"
                            name="email"
                            placeholder="E-mail address"
                            onChange={handleChange}
                            onBlur={handleInvalidation}
                            onInput={handleInput}
                            onKeyDown={(e) => {
                                handleEnter(e, handleSubmit);
                            }}
                        />
                        <p className="error-message">{errors.email}</p>
                    </form>
                    <button className="signup-btn" onClick={handleSubmit}>
                        Sign Up
                    </button>
                    <div className="signin-action">
                        Have an account?{" "}
                        <span>
                            <Link to="/sign-in">Sign In</Link>
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
        </>
    );
};

export default SignUp;
