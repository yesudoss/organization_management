import axios from "axios";


const AxiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api/',
    timeout: 10000
});

AxiosInstance.interceptors.request.use(
    function (config) {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `JWT ${token}`;
        }
        return config;
    }, function (error) {
        return Promise.reject(error);
    });

AxiosInstance.interceptors.response.use(
    function (response) {
        return response;
    }, function (error) {
        return Promise.reject(error);
    });

export default AxiosInstance