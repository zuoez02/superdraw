const ERR_CODE = {
    // 基础格式 7位数 xx_xx_xx_xxx:(部门_地区_业务_类型)
    "200102311": {
        err_code: '200102311',
        status: 'error',
        err_msg: 'this is a net err',
        callback() {

        },
    },
    "3333333": {
        err_code: '333333',
        status: 'error',
        err_msg: '没有命中错误码',
        callback() {

        },
    }
};
Object.freeze(ERR_CODE);

export const checkErrCode = err_code_res => {
    if (+err_code_res === 0) {
        return false;
    }
    const NO_ERR_CODE_IN_TABLE = '3333333';
    let err;
    if (err_code_res in ERR_CODE) {
        err = ERR_CODE[err_code_res];
    } else {
        err = ERR_CODE[NO_ERR_CODE_IN_TABLE];
    }
    const { err_code, status, err_msg, callback } = err;
    callback();
    return {
        err_code,
        status,
        err_msg,
    };
};
export default ERR_CODE;