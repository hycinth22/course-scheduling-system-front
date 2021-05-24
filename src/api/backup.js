import request, {getURL} from "../utils/request";

const base = '/backup'

export const uploadBackupURL = getURL(base + '/upload');
export const downloadBackupURL = (name) => {
    return getURL(base + '/download?name=' + encodeURIComponent(name));
};

export const listBackups = () => {
    return request({
        url: base + '/list',
        method: 'get',
        params: {}
    });
};

export const delBackup = (name) => {
    return request({
        url: base + '/' + name,
        method: 'delete',
        params: {},
    });
};


export const createBackup = () => {
    return request({
        url: base + '/new',
        method: 'post',
        params: {},
    });
};

export const applyBackup = (name) => {
    return request({
        url: base + '/apply',
        method: 'put',
        params: {name: name},
        timeout: 15000,
    });
};

