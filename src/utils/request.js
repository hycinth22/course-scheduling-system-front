import axios from 'axios';

const devURLRoot = 'http://localhost:8085/admin';
const prodURLRoot = 'http://localhost:8085/admin';
const root = (process.env.NODE_ENV === 'development' ? devURLRoot : prodURLRoot);
const service = axios.create({
    baseURL: root,
    timeout: 5000
});

service.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return response.data;
        } else {
            Promise.reject();
        }
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);



export default service;

export const getURL = function (url) {
    return root+url;
}