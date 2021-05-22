let roles = {
    "admin": "系统管理",
    "operator": "教务排课",
    "teacher": "教师",
}
export default roles;

export const getRoleStr = (role) => {
    return roles[role] ? roles[role] : "普通用户";
}