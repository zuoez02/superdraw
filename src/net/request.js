import axios from "axios";
import { interRequest, interResponse } from "./interceptors";
import {checkErrCode} from "./error_code";


export const BASE_URL = window.location.protocol + "//" + window.location.host;

// base_url设置
axios.defaults.baseURL = BASE_URL;
// content-type头设置
axios.defaults.headers["Content-Type"] = "*";
// 超时设置
axios.defaults.timeout = 10000;
// 拦截器设置
axios.interceptors.response.use(...interResponse);
axios.interceptors.request.use(...interRequest);

// 接口数据：err_code, data
// {code: xxx, msg: '',  data: {},}
export function post(url, params, headers = {}) {
        return axios({
            method: "post",
            headers: {
                ...axios.defaults.headers,
                ...headers,
            },
            url,
            data: params
        }).then(response => {
            // 正常信息
            const data = checkErrCode(response?.data?.code);
            console.log(`Data is ${data} and Response is ${response}`);
            if(!data) {
                return Promise.resolve(response?.data);
            } else {
                return Promise.reject(data);
            }
        }).catch(err => {
            // console.log(`Get ${err}`);
            return Promise.reject(err);
        });
    }
export function get(url, params = {}) {
        return axios({
            method: "get",
            url,
            data: params
        }).then(response => {
           // 正常信息
           const data = checkErrCode(response?.data?.code);
           if(!data) {
               return Promise.resolve(response?.data);
           } else {
               return Promise.reject(data);
           }
        }).catch(err => {
            // console.log(`Post ${err}`);
            return Promise.reject(err);
        });
    }