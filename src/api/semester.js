import request from "../utils/request";

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