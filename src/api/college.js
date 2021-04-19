import request from "../utils/request";

export const listColleges = () => {
    return request({
        url: '/college',
        method: 'get',
        params: []
    });
};