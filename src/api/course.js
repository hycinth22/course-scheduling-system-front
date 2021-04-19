import request from '../utils/request';

export const listCourses = query => {
    return request({
        url: '/course',
        method: 'get',
        params: query
    });
};

export const addCourse = course => {
    return request({
        url: '/course',
        method: 'post',
        data: course
    });
};


export const updateCourse = course => {
    return request({
        url: '/course/' + course.id,
        method: 'put',
        data: course
    });
};

export const deleteCourse = id => {
    return request({
        url: '/course/'+id,
        method: 'delete',
    });
};