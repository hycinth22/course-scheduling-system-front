import request, {getURL} from "../utils/request";

export const listColleges = () => {
    return request({
        url: '/college',
        method: 'get',
        params: []
    });
};

export const uploadCollegeExcelURL = () => {
    return getURL("/college/excel");
}