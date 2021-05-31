export function getUser() {
    return JSON.parse(localStorage.getItem("ms_userprofile"));
}
export function getUsername() {
    return localStorage.getItem("ms_username");
}