import { post } from './request';
// import {getCurrentWidgetId} from "../common/utils";



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