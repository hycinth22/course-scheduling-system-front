import request, {getURL} from "../utils/request";

export const listDepartmentsInCollege = (college_id) => {
    return request({
        url: '/dept',
        method: 'get',
        params: {
            college_id: college_id
        }
    });
};

export const listDepartments = query => {
    return request({
        url: '/dept',
        method: 'get',
        params: query
    });
};

export const addDepartment = dept => {
    return request({
        url: '/dept',
        method: 'post',
        data: dept
    });
};

export const updateDepartment = dept => {
    return request({
        url: '/dept/' + dept.dept_id,
        method: 'put',
        data: dept
    });
};

export const deleteDepartment = id => {
    return request({
        url: '/dept/' + id,
        method: 'delete',
    });
};

export const uploadDepartmentExcelURL = () => {
    return getURL("/dept/excel");
}