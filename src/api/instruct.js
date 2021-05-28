import request, {getURL} from '../utils/request';

export const listInstructs = query => {
    return request({
        url: '/instruct/list',
        method: 'get',
        params: query
    });
};

export const addInstructs = course => {
    return request({
        url: '/instruct',
        method: 'post',
        params: course
    });
};


export const updateInstructs = course => {
    return request({
        url: '/instruct',
        method: 'put',
        params: course
    });
};

export const deleteInstructs = id => {
    return request({
        url: '/instruct',
        method: 'delete',
        params: {"id": id}
    });
};

export const listInstructsClazzes = instruct_id => {
    return request({
        url: '/instruct/clazzes',
        method: 'get',
        params: {"instruct_id": instruct_id}
    });
};

export const resetInstructsClazzes = (instruct_id, list) => {
    return request({
        url: '/instruct/instructed_clazzes',
        method: 'put',
        params: {"instruct_id": instruct_id},
        data: list,
    });
};

export const uploadInstructExcelURL = () => {
    return getURL("/instruct/excel");
}

export const uploadInstructClazzesExcelURL = () => {
    return getURL("/instruct/instructed_clazzes/excel");
}