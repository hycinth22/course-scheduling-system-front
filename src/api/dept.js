import request from "../utils/request";

export const listDepartmentsInCollege = (college_id) => {
    return request({
        url: '/dept',
        method: 'get',
        params: {
            college_id: college_id
        }
    });
};