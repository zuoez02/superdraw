import { getCurrentEnv, CURRENT_ENV } from "./env";
let self = window || global;
/** 获取当前挂件块的 id */
export const getCurrentWidgetId = () => {
    const env = getCurrentEnv();
    if (env === CURRENT_ENV.oceanPress) {
        return self.frameElement?.parentElement?.dataset.nId;
    } else if (env === CURRENT_ENV.siYuan) {
        return self.frameElement?.parentElement?.parentElement?.dataset.nodeId;
    } else if (env === CURRENT_ENV.unknown) {
    } else {
        const exhaustiveCheck = env;
    }
    return undefined;
};