import apiUrl from "@/config/api";

const resendEmail = (email) => {
    fetch(`${apiUrl}/v1/auth/resend-email`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email,
            action: "verify",
        }),
    }).catch((error) => console.error("Error: ", error));
};

export default resendEmail;
