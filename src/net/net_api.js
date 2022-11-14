import axios from 'axios';
import { post } from './request';

// 上传资源文件
export const uploadFile = async (files, path = '/assets/') => {
    const formData = new FormData();
    formData.append('assetsDirPath', path);
    formData.append('file[]', files);
    try {
        const res = await post('/api/asset/upload', formData, {
            "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundarywQfr1gRNyYgeIt9h",
        });
        return res.data;
    } catch (e) {
        return e;
    }

};

// 下载文件
export const downloadFile = async (name) => {
    return axios.get(name, {}).then(res => {
        return res ? res.data : undefined;
    });
};

// 设置块属性
export const setWidgetAttr = async (id, attrs) => {
    try {
        const res = await post('/api/attr/setBlockAttrs', {
            id: `${id}`,
            attrs,
        });
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