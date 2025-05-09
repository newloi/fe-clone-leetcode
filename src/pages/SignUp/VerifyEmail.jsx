import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { handleEnter } from "../SignIn/SignIn";
import "./VerifyEmail.css";
import apiUrl from "@/config/api";
import resendEmail from "@/api/resendEmail";

const VerifyEmail = () => {
    const { emailAddress } = useParams();

    const navigate = useNavigate();

    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [countdown, setCountdown] = useState("60");
    const [isActive, setIsActive] = useState(false);

    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

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
                    toast.success(
                        "Welcome! Your account has been successfully registered.",
                        {
                            autoClose: 3000,
                        }
                    );
                    navigate("/");
                } else {
                    setError("Something is wrong!");
                }
            });
        }
    };

    // handle resend code verify
    const handleResendCode = () => {
        if (!isActive) {
            resendEmail(emailAddress);
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
                    ref={inputRef}
                    className="input input-without-icon input-code"
                    type="text"
                    maxLength="8"
                    placeholder="Enter your code"
                    onInput={handleChange}
                    onKeyDown={(e) => {
                        handleEnter(e, handleVerify);
                    }}
                />
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
};

export default VerifyEmail;
