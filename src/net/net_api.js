import axios from 'axios';
import { post } from './request';
// import {getCurrentWidgetId} from "../common/utils";

// 上传资源文件
// export const uploadFile = async (id) => {
//
//     try {
//         const res = await post('/api/asset/upload', id, {
//             "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundarywQfr1gRNyYgeIt9h",
//         });
//         console.log(res);
//         return res.data;
//     } catch (e) {
//         return e;
//     }
//
// };

// 下载文件
// export const downloadFile = async (name) => {
//     return axios.get(name, {}).then(res => {
//         console.log("HHAHAHAHAHAHA");
//         console.log(name);
//         console.log(res);
//         return res ? res.data : undefined;
//     });
// };



// 设置块属性
export const setWidgetAttr = async (id, attrs) => {
    try {
        const res = await post('/api/attr/setBlockAttrs', {
            id: `${id}`,
            attrs,
        });
        console.log(res);
        return res.data;
    } catch (e) {
        return e;
    }

};

// custom-excalidraw: '',


// 获取块属性
export const getWidgetAttr = async (id) => {
    try {
        const res = await post('/api/attr/getBlockAttrs', {
            id: `${id}`,
        });

        return res.data;
    } catch (e) {
        return e;
    }

};