import { useState } from "react";

import "./SignUp.css";
import logo from "../../assets/logo.svg";

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
    const handleErrorInput = (e) => {
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
                if (status === 409) console.error("username or email is used!");
                else if (status === 201) {
                    console.log("account is created");
                    /** Navigate to verify email */
                } else console.error("another error!");
            });
        }
    };

    // check account's status when submit
    const getStatusSignUp = () => {
        return fetch("https://leetclone-be.onrender.com/v1/auth/register", {
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
            .then((response) => {
                console.log("Status: ", response.status);
                return response.status;
            })
            .catch((error) => console.error("Error: ", error));
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
                        onInput={handleErrorInput}
                    />
                    <div className="error-message-container">
                        <p className="error-message">{errors.username}</p>
                    </div>
                    <label className="input input-with-icon">
                        <input
                            type={showPassword ? "text" : "password"}
                            className=""
                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                            onBlur={handleInvalidation}
                            onInput={handleErrorInput}
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
                    <div className="error-message-container">
                        <p className="error-message">{errors.password}</p>
                    </div>
                    <label className="input input-with-icon">
                        <input
                            type={showPassword ? "text" : "password"}
                            className=""
                            name="confirmPassword"
                            placeholder="Confirm password"
                            onChange={handleChange}
                            onBlur={handleInvalidation}
                            onInput={handleErrorInput}
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
                    <div className="error-message-container">
                        <p className="error-message">
                            {errors.confirmPassword}
                        </p>
                    </div>
                    <input
                        type="email"
                        className="input input-without-icon"
                        name="email"
                        placeholder="E-mail address"
                        onChange={handleChange}
                        onBlur={handleInvalidation}
                        onInput={handleErrorInput}
                    />
                    <div className="error-message-container">
                        <p className="error-message">{errors.email}</p>
                    </div>
                </form>
                <button className="signup-btn" onClick={handleSubmit}>
                    Sign Up
                </button>
                <div className="signin-action">
                    Have an account? <span>Sign In</span>
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
