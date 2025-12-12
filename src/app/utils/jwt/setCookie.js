export const setCookie = (res, tokenInfo) => {
    if (tokenInfo.accessToken) {
        res.cookie("accessToken", tokenInfo.accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });
    }
    if (tokenInfo.refreshToken) {
        res.cookie("refreshToken", tokenInfo.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });
    }
};
