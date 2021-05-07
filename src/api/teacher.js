import request from "../utils/request";

export const listTeachers = query => {
    return request({
        url: '/teacher',
        method: 'get',
        params: query
    });
};

export const addTeacher = obj => {
    return request({
        url: '/teacher/new' ,
        method: 'post',
        data: obj
    });
};

export const updateTeacher = obj => {
    return request({
        url: '/teacher/' + obj.id,
        method: 'put',
        data: obj
    });
};

export const deleteTeacher = id => {
    return request({
        url: '/teacher/' + id,
        method: 'delete',
    });
};
