import request, {getURL} from "../utils/request";

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

export const listTeachersInCollege = (college_id) => {
    return request({
        url: '/teacher/list',
        method: 'get',
        params: {
            college_id: college_id
        }
    });
};

export const uploadTeacherExcelURL = () => {
    return getURL("/teacher/excel");
}