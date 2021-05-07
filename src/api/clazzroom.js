import request from "../utils/request";
import {getURL} from '../utils/request';

export const listClassrooms = query => {
    return request({
        url: '/clazzroom',
        method: 'get',
        params: query
    });
};

export const addClassroom = clazzroom => {
    return request({
        url: '/clazzroom',
        method: 'post',
        data: clazzroom
    });
};

export const updateClassroom = clazzroom => {
    return request({
        url: '/clazzroom/' + clazzroom.id,
        method: 'put',
        data: clazzroom
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