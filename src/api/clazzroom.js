import request from "../utils/request";
import {getURL} from '../utils/request';

export const listClassrooms = query => {
    return request({
        url: '/clazzroom',
        method: 'get',
        params: query
    });
};

export const addClassroom = course => {
    return request({
        url: '/clazzroom',
        method: 'post',
        data: course
    });
};

export const updateClassroom = course => {
    return request({
        url: '/clazzroom/' + course.id,
        method: 'put',
        data: course
    });
};

export const deleteClassroom = id => {
    return request({
        url: '/clazzroom/' + id,
        method: 'delete',
    });
};

export const uploadClassroomExcelURL = () => {
    return getURL("/clazzroom/excel");
}