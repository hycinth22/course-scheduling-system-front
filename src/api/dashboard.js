import request from "../utils/request";

const base = '/dashboard';

export function getSummary() {
    return request({
        url: base + '/summary',
        method: 'get',
    });
}