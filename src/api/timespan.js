import request from "../utils/request";

export const listTimespans = () => {
    return request({
        url: '/timespan',
        method: 'get',
        params: []
    });
};