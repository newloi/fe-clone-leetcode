import apiUrl from "@/config/api";

const refreshAccessToken = async () => {
    try {
        const res = await fetch(`${apiUrl}/v1/auth/refresh`, {
            method: "GET",
            credentials: "include",
        });

        const data = await res.json();

        if (res.ok && data.accessToken) {
            sessionStorage.setItem("accessToken", data.accessToken);
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("refresh token error: ", error);
        return false;
    }
};

export default refreshAccessToken;
