import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import "./VerifyEmail.css";
import apiUrl from "@/config/api";

function VerifyEmail() {
    const { emailAddress } = useParams();

    const navigate = useNavigate();

    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [countdown, setCountdown] = useState("60");
    const [isActive, setIsActive] = useState(false);

    // update values when user is typing...
    const handleChange = (e) => {
        setCode(e.target.value);
        setError("");
        e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
    };

    // handle when user clicks verify button
    const handleVerify = () => {
        if (code.length !== 8) {
            setError("Code is too short!");
        } else {
            getVerifyStatus().then((status) => {
                if (status === 400) setError("Wrong code!");
                else if (status === 200) {
                    console.log("Code: ", code);
                    toast.success(
                        "Welcome! Your account has been successfully registered.",
                        {
                            autoClose: 3000,
                        }
                    );
                    navigate("/");
                } else {
                    setError("Something is wrong!");
                    console.error("Something is wrong!");
                }
            });
        }
    };

    // handle resend code verify
    const handleResendCode = () => {
        if (!isActive) {
            fetch(`${apiUrl}/v1/auth/resend-email`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: emailAddress,
                    action: "verify",
                }),
            })
                .then((response) => {
                    console.log("Status ResendEmail: ", response.status);
                })
                .catch((error) => console.error("Error: ", error));
            setIsActive(true);
            setCountdown(60);
        }
    };

    useEffect(() => {
        if (isActive && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown((prevState) => prevState - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (isActive && countdown === 0) setIsActive(false);
    }, [isActive, countdown]);

    // get status verify
    const getVerifyStatus = () => {
        return fetch(`${apiUrl}/v1/auth/verify-email`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: emailAddress,
                pin: code,
            }),
        })
            .then((response) => {
                console.log("Status: ", response.status);
                console.log("Code: ", code);

                return response.status;
            })
            .catch((error) => console.error("Error: ", error));
    };

    return (
        <div className="verify-box">
            <h3 className="title-verify">Verify Your Email</h3>
            <p className="description-verify">
                Please enter the code that has been sent to{" "}
                <span className="target-email">{emailAddress}</span>
            </p>
            <div className="verify-container">
                <input
                    className="input input-without-icon input-code"
                    type="text"
                    maxLength="8"
                    placeholder="Enter your code"
                    onInput={handleChange}
                />
                {/* <div className="letters-group">
                    <input
                        className="input input-without-icon input-letter"
                        type="text"
                        maxLength="1"
                        onInput={handleInput}
                    />
                    <input
                        className="input input-without-icon input-letter"
                        type="text"
                        maxLength="1"
                        onInput={handleInput}
                    />
                    <input
                        className="input input-without-icon input-letter"
                        type="text"
                        maxLength="1"
                        onInput={handleInput}
                    />
                    <input
                        className="input input-without-icon input-letter"
                        type="text"
                        maxLength="1"
                        onInput={handleInput}
                    />
                    <input
                        className="input input-without-icon input-letter"
                        type="text"
                        maxLength="1"
                        onInput={handleInput}
                    />
                    <input
                        className="input input-without-icon input-letter"
                        type="text"
                        maxLength="1"
                        onInput={handleInput}
                    />
                    <input
                        className="input input-without-icon input-letter"
                        type="text"
                        maxLength="1"
                        onInput={handleInput}
                    />
                    <input
                        className="input input-without-icon input-letter"
                        type="text"
                        maxLength="1"
                        onInput={handleInput}
                    />
                </div> */}
                <p className="error-message">{error}</p>
            </div>
            <button className="resend-code" onClick={handleResendCode}>
                Resend Code {isActive && <span>({countdown})</span>}
            </button>
            <button className="verify-btn signup-btn" onClick={handleVerify}>
                Verify
            </button>
        </div>
    );
}

export default VerifyEmail;
