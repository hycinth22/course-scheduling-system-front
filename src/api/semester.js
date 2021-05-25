import request from "../utils/request";

const base = '/semester'
export const listSemesters = (notHidePast) => {
    if(notHidePast===undefined) notHidePast=false;
    return request({
        url: '/semester',
        method: 'get',
        params: {notHidePast: notHidePast},
        timeout: 15000,
    });
};

export const getHiddenPastSemester = () => {
    return request({
        url: '/semester/hide_past_semester_config',
        method: 'get',
    });
};

export const saveHiddenPastSemester = (val) => {
    return request({
        url: '/semester/hide_past_semester_config',
        method: 'put',
        params: {val: val}
    });
};


export const addSemester = obj => {
    return request({
        url: base + '/new',
        method: 'post',
        data: obj
    });
};

export const updateSemester = obj => {
    return request({
        url: base + '/' + obj.start_date,
        method: 'put',
        data: obj
    });
};

export const deleteSemester = start_date => {
    return request({
        url: base,
        method: 'delete',
        params: {start_date: start_date},
    });
};
