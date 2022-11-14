let self = window || global;
export function getCurrentEnv() {
    try {
      // let s = self.parent?.document;
    } catch (e) {
      // 处于非同源 iframe，无法探知当前环境
      return CURRENT_ENV.unknown;
    }
    if (querySelector(`main[data-n-id]`)) {
      return CURRENT_ENV.env.oceanPress;
    } else if (
      querySelector(`.protyle-content`) &&
      querySelector(`[data-node-id]`)
    ) {
      return CURRENT_ENV.siYuan;
    }
  
    return CURRENT_ENV.unknown;
  }
  export const CURRENT_ENV = {
    siYuan: "siYuan",
    oceanPress: "oceanPress",
    unknown: "unknown",
  };
  
  function querySelector(selectors) {
    return self.parent?.document.querySelector(selectors);
  }