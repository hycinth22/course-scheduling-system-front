import request, {getURL} from "../utils/request";
const base = '/clazz'

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
};


export const addClazz = obj => {
    return request({
        url: base + '/new',
        method: 'post',
        data: obj
    });
};

export const updateClazz = obj => {
    return request({
        url: base + '/' + obj.clazz_id,
        method: 'put',
        data: obj
    });
};

export const deleteClazz = clazz_id => {
    return request({
        url: base,
        method: 'delete',
        params: {clazz_id: clazz_id},
    });
};
