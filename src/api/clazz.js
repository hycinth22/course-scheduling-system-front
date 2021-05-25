import request, {getURL} from "../utils/request";

export const listClazzesInCollege = (college_id) => {
    return request({
        url: '/clazz',
        method: 'get',
        params: {
            college_id: college_id
        }
    });
};

export const listClazzes = query => {
    return request({
        url: '/clazz/list',
        method: 'get',
        params: query
    });
};


export const uploadClazzExcelURL = () => {
    return getURL("/clazz/excel");
}