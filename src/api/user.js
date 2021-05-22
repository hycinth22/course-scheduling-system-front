import request from "../utils/request";

const base = '/user'
export const listUsers = query => {
    return request({
        url: base + '/list',
        method: 'get',
        params: query
    });
};

export const getLoginInfo = query => {
    return request({
        url: base + '/login_state',
        method: 'get',
        params: query
    });
};

export const setUserStatus = (id, status) => {
    return request({
        url: base + '/' + id + "/status",
        method: 'put',
        params: {
            Value: status,
        }
    });
};

export const resetUserPassword = (id, password) => {
    return request({
        url: base + '/' + id + "/password",
        method: 'put',
        params: {
            Value: password,
        }
    });
};


export const addUser = obj => {
    return request({
        url: base + '/',
        method: 'post',
        data: obj
    });
};

export const updateUser = obj => {
    return request({
        url: base + '/' + obj.id,
        method: 'put',
        data: obj
    });
};

export const deleteUser = id => {
    return request({
        url: base + '/' + id,
        method: 'delete',
    });
};
