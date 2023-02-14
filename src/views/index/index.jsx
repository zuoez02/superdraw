import React, { useEffect, useState, useRef, useMemo } from "react";
import { getCurrentWidgetId } from '../../common/utils';
import {
  Excalidraw,
  serializeAsJSON,
} from "@excalidraw/excalidraw";
import { Icon } from 'react-kui';
import initialData from "../../common/initialData";
import {setWidgetAttr, getWidgetAttr } from "../../net/net_api";
import "./index.css";
import {debounce} from "lodash";

const getDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDay();
  return `${year}-${month}-${day}_${Date.now()}`;
};
const renderTopRightUI = (theme, grid, view, {
  onLanguage, // 设置语言
  setTheme, // 设置主题
  setGrid, // 设置网格
  setView, // 设置视图模式
  setZen, // 禅模式
  saveFile,
  toggleFullscreen,
}) => {
  return (
    <div
      className="excalidraw_top-right_wrap"
    >
      <div className="excalidraw_top-right_function">
        <div title="保存" onClick={() => {
          // TODO: 归档保存
          saveFile();
        }}>
          <Icon type="file-tray-full-outline" size="18" color="#f00" />
        </div>
        <div title="切换全屏" onClick={() => { toggleFullscreen() }}>
          <Icon type="expand-outline" size="18" />
        </div>
      </div>
    </div>
  );
};

const renderFooter = () => {
  return (<></>);
};

export default function Index() {
  const excalidrawRef = useRef(null);
  // 设置视图模式
  const [viewModeEnabled, setViewModeEnabled] = useState(false);
  // 设置禅模式
  const [zenModeEnabled, setZenModeEnabled] = useState(false);
  // 设置网格模式
  const [gridModeEnabled, setGridModeEnabled] = useState(false);
  // 设置主题
  const [theme, setTheme] = useState("light");
  // 语言设置
  const [lang, setLang] = useState(navigator.language === 'zh' ? 'zh-CN' : navigator.language);
  // 获取挂件块ID
  let currentWidgetId = useMemo(() => getCurrentWidgetId(), []);

  // 获取的数据对象
  const [savedData, setSavedData] = useState(initialData);

  const [initialized, setInitialized] = useState(false);

  const [isFullScreen, setisFullScreen] = useState(false);

  function StringtoJson(excalidrawData) {
    return new Promise((resolve)=>{
      resolve(JSON.parse(excalidrawData))
    });
  };

  async function saveExcalidrawFile_without_notification() {
    console.log("Debounce");
    if (currentWidgetId===undefined){
      const search = window.location.search;
      currentWidgetId = search.split("=")[1];
    };
    const json = serializeAsJSON(excalidrawRef.current.getSceneElements(), excalidrawRef.current.getAppState(), excalidrawRef.current.getFiles(), 'local');
    try {
      // 获取返回后的地址，保存在挂件块的custom-excalidraw属性上
      setWidgetAttr(currentWidgetId, {
        "custom-excalidraw-data": json,
      });
    } catch (e) {
      console.error(e);
    }
  }


  const debounce_fun = debounce(saveExcalidrawFile_without_notification,1000);

  useEffect(()=>{
    window.addEventListener('pointerup',debounce_fun)
    return ()=>{
      window.removeEventListener('pointerup',debounce_fun)

    }
  });

  // useEffect(()=>{
  //   const interval = setInterval(()=>{
  //     saveExcalidrawFile_without_notification();
  //   },30000);
  //   return ()=>clearInterval(interval);
  // });

  async function toggleFullscreen() {
    const el = document.getElementsByClassName('excalidraw-wrapper')[0];
    if (!el) {
      return;
    }
    if (!isFullScreen) {
      if (el.requestFullscreen){
        el.requestFullscreen();
      }
      else if(el.webkitRequestFullscreen){
        el.webkitRequestFullscreen();
      }
      else if (el.msRequestFullscreen){
        el.msRequestFullscreen();
      }
    }
    else {
      document.exitFullscreen && document.exitFullscreen();
    }
    setisFullScreen(!isFullScreen);
  }

  async function saveExcalidrawFile() {

    if (currentWidgetId===undefined){
      const search = window.location.search;
      currentWidgetId = search.split("=")[1];
    };
    const json = serializeAsJSON(excalidrawRef.current.getSceneElements(), excalidrawRef.current.getAppState(), excalidrawRef.current.getFiles(), 'local');

    try {
      // 获取返回后的地址，保存在挂件块的custom-excalidraw属性上
      setWidgetAttr(currentWidgetId, {
        "custom-excalidraw-data": json,
      });
      excalidrawRef.current.setToast({ message: '保存成功' });
    } catch (e) {
      excalidrawRef.current.setToast({ message: '保存失败' });
      console.error(e);
    }

  }


  useEffect(() => {
    async function getExcalidrawFile() {
      // 获取挂件的custom-excalidraw属性
      let block_data;
      if (currentWidgetId===undefined){
        const search = window.location.search;
        currentWidgetId = search.split("=")[1];
      }
      block_data = await getWidgetAttr(currentWidgetId);

      const excalidrawData = block_data['custom-excalidraw-data'];
      if (excalidrawData) {
        StringtoJson(excalidrawData).then(res => {
          setSavedData(res);
          setInitialized(true);
        })
      } else {
        setInitialized(true);
      }
    }
    getExcalidrawFile();
  }, [currentWidgetId]);

  return (
    <div className="App">
      <div className="excalidraw-wrapper" onBlur={() => {
      }}>
        {(initialized && <Excalidraw
          ref={excalidrawRef}
          initialData={savedData}
          viewModeEnabled={viewModeEnabled}
          zenModeEnabled={zenModeEnabled}
          gridModeEnabled={gridModeEnabled}
          theme={theme}
          name={getDate()}
          UIOptions={{
            canvasActions: {
              loadScene: true,
              theme: true,
            }
          }}
          renderTopRightUI={() => renderTopRightUI(
            theme,
            gridModeEnabled,
            viewModeEnabled,
            {
              onLanguage: (lang) => setLang(lang),
              setTheme: () => { theme === 'light' ? setTheme('dark') : setTheme('light') },
              setGrid: () => setGridModeEnabled(!gridModeEnabled),
              setView: () => setViewModeEnabled(!viewModeEnabled),
              setZen: () => setZenModeEnabled(!zenModeEnabled),
              saveFile: () => saveExcalidrawFile(),
              toggleFullscreen: () => toggleFullscreen(),
            }
          )}
          renderFooter={renderFooter}
          langCode={lang}
          autoFocus={false}
          detectScroll={true}
        />)}
      </div>
    </div>
  );
}
