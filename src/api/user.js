import request from "../utils/request";

export const listUsers = query => {
    return request({
        url: '/user/list',
        method: 'get',
        params: query
    });
};


export const getLoginInfo = query => {
    return request({
        url: '/user/login_state',
        method: 'get',
        params: query
    });
};