import axios from 'axios';

function createService(root) {
    let service = axios.create({
        baseURL: root,
        timeout: 5000
    });
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
    service.interceptors.request.use(
        config => {
            return config;
        },
        error => {
            console.log(error);
            return Promise.reject();
        }
    );
    return service;
}

const root = (process.env.NODE_ENV === 'development' ? window.dev_root : window.prod_root);
const service = createService(root);
console.log("api root:", root);

export default service;

export const getURL = function (url) {
    return root + url;
}