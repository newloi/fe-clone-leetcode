import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import apiUrl from "@/config/api";

export const ResetPassword = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    // clear error when user is typing...
    const handleInput = () => {
        setError("");
    };

    // update values when user is typing...
    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    // validation input email
    const handleInvalidation = (e) => {
        if (e.target.value.trim() === "") {
            setError("Required");
            return;
        } else if (!emailRegex.test(e.target.value)) {
            setError("Invalid email address.");
        }
    };

    // handle submission
    const handleSubmit = () => {
        if (email) {
            getStatusPasswordReset().then((status) => {
                if (status === 200) {
                    console.log("Success! Navigate to verify email");
                    navigate(`/forgot-password/change-password/${email}`);
                } else {
                    console.log("Something is wrong");
                }
            });
        } else {
            setError("Required");
            console.log("empty email");
        }
    };

    // get status submission
    const getStatusPasswordReset = () => {
        return fetch(`${apiUrl}/v1/auth/forgot-password`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
            }),
        })
            .then((response) => {
                console.log("Password reset status: ", response.status);
                return response.status;
            })
            .catch((error) => console.error("Password reset error: ", error));
    };

    return (
        <div className="reset-form">
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
                    onChange={handleChange}
                    onInput={handleInput}
                    onBlur={handleInvalidation}
                />
                <p className="error-message">{error}</p>
            </div>

            <button className="reset-btn" onClick={handleSubmit}>
                Reset My Password
            </button>
        </div>
    );
};

export const ChangePassword = () => {
    const { emailAddress } = useParams();
    const passwordRegex = /^[A-Za-z0-9]{8,}$/;
    const [passwords, setPasswords] = useState({
        newPassword: "",
        confirmNewPassword: "",
        code: "",
    });
    const [errors, setErrors] = useState({
        newPassword: "",
        confirmNewPassword: "",
        code: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    // const navigate = useNavigate();

    // update account when user is typing...
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords({ ...passwords, [name]: value });
    };

    //handle when user finishes a field
    const handleInvalidation = (e) => {
        const { name, value } = e.target;

        if (value.trim() === "") {
            setErrors({ ...errors, [name]: "Required" });
            return;
        }
        switch (name) {
            case "newPassword":
                if (!passwordRegex.test(value)) {
                    setErrors({
                        ...errors,
                        [name]: "Must be at least 8 characters with letter and number, no special or non-ASCII characters.",
                    });
                }
                break;
            case "confirmNewPassword":
                if (value !== passwords.newPassword) {
                    setErrors({
                        ...errors,
                        [name]: "The password you entered do not match.",
                    });
                }
                break;
            case "code":
                if (passwords.code.length !== 8) {
                    setErrors({
                        ...errors,
                        [name]: "The code is too short!",
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
        for (let prop in passwords) {
            if (passwords[prop] === "") {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [prop]: "Required",
                }));

                isValid = false;
                console.log("Invalid input");
            }
        }
        if (isValid) {
            getStatusChangePassword().then((status) => {
                if (status === 200) {
                    alert("Password change successful!");
                    console.log("Successful! Navigate to home page");
                    toast.success(
                        "Your password has been changed successfully.",
                        { autoClose: 3000 }
                    );
                } else if (status === 400) {
                    setErrors({
                        ...errors,
                        code: "Wrong code!",
                    });
                    console.error("Wrong code");
                } else console.error("another error!");
            });
        }
    };

    const getStatusChangePassword = () => {
        return fetch(`${apiUrl}/v1/auth/reset-password`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: emailAddress,
                pin: passwords.code,
                password: passwords.password,
            }),
        })
            .then((response) => {
                console.log("Change password status: ", response.status);
                return response.status;
            })
            .catch((error) => {
                console.log("Change password error: ", error);
            });
    };
    return (
        <div className="reset-form">
            <h3 className="reset-form-heading">Change Password</h3>
            <hr />
            <div className="form-group">
                <input
                    type="text"
                    className="input input-without-icon"
                    name="code"
                    placeholder="Verify Code"
                    onChange={handleChange}
                    onBlur={handleInvalidation}
                    onInput={handleInput}
                />
                <p className="error-message">{errors.code}</p>
                <label className="input input-with-icon">
                    <input
                        type={showPassword ? "text" : "password"}
                        className=""
                        name="newPassword"
                        placeholder="New password"
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
                <p className="error-message">{errors.newPassword}</p>
                <label className="input input-with-icon">
                    <input
                        type={showPassword ? "text" : "password"}
                        className=""
                        name="confirmNewPassword"
                        placeholder="Confirm new password"
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
                <p className="error-message">{errors.confirmNewPassword}</p>
            </div>

            <button className="reset-btn" onClick={handleSubmit}>
                Change Password
            </button>
        </div>
    );
};
