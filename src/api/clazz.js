import request from "../utils/request";

export const listClazzesInCollege = (college_id) => {
    return request({
        url: '/clazz',
        method: 'get',
        params: {
            college_id: college_id
        }
    });
};