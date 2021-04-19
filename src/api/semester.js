import request from "../utils/request";

export const listSemesters = () => {
    return request({
        url: '/semester',
        method: 'get',
        params: [],
        timeout: 15000,
    });
};