import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import HashLoader from "react-spinners/HashLoader";

import "./SignIn.css";
import logo from "@/assets/logo.svg";
import apiUrl from "@/config/api";

const SignIn = () => {
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

    const inputUsername = useRef(null);
    const inputPassword = useRef(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        inputUsername.current?.focus();
    }, []);

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
    const handleSubmit = async () => {
        setIsLoading(true);
        const signInRequest = async () => {
            return await fetch(`${apiUrl}/v1/auth/login`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: account.username,
                    password: account.password,
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
                const res = await signInRequest();
                if (res.status === 200) {
                    const data = await res.json();
                    sessionStorage.setItem("accessToken", data.accessToken);
                    sessionStorage.setItem("csrfToken", data.csrfToken);
                    const decode = jwtDecode(data.accessToken.toString());
                    if (decode.role === "USER")
                        navigate(
                            `${sessionStorage.getItem("lastVisit") || "/"}`
                        );
                    else navigate("/admin/problems");
                } else if (res.status === 401) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        password: "The password you specified are not correct.",
                    }));
                } else if (res.status === 404) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        username: "The username you specified are not correct.",
                    }));
                }
            }
        } catch (e) {
            console.error("Sign in error: ", e);
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
                    <form action="" className="signup">
                        <input
                            ref={inputUsername}
                            type="text"
                            className="input input-without-icon"
                            name="username"
                            placeholder="Username or E-mail"
                            onChange={handleChange}
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
                                name="password"
                                className=""
                                placeholder="Password"
                                onChange={handleChange}
                                onInput={handleInput}
                                onKeyDown={(e) => {
                                    handleEnter(e, handleSubmit);
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
        </>
    );
};

export default SignIn;

export const handleEnter = (e, handleEnter, nextRef, object) => {
    if (e.key === "Enter") {
        if (nextRef) {
            if (Object.values(object).every((value) => value !== ""))
                handleEnter();
            else nextRef.current?.focus();
        } else handleEnter();
    }
};
