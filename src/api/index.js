import request from '../utils/request';

export const fetchData = query => {
    return request({
        url: './user.json',
        method: 'get',
        params: query
    });
};

export const listDepartments = query => {
    return request({
        url: './department.json',
        method: 'get',
        params: query
    });
};

export const listClasses = query => {
    return request({
        url: './class.json',
        method: 'get',
        params: query
    });
};

export const listTeachers = query => {
    return request({
        url: './teacher.json',
        method: 'get',
        params: query
    });
};

export const listTerms = query => {
    return request({
        url: './term.json',
        method: 'get',
        params: query
    });
};

export const listStudents = query => {
    return request({
        url: './student.json',
        method: 'get',
        params: query
    });
};


export const listColleges = () => {
    return request({
        url: './college.json',
        method: 'get',
        params: []
    });
};

export const listSpecs = query => {
    return request({
        url: './spec.json',
        method: 'get',
        params: query
    });
};