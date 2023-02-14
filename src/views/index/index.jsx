import React, { useEffect, useState, useRef, useMemo } from "react";
import { getCurrentWidgetId } from '../../common/utils';
import {
  Excalidraw,
  // languages,
  serializeAsJSON,
} from "@excalidraw/excalidraw";
import { Icon } from 'react-kui';
import initialData from "../../common/initialData";
import {setWidgetAttr, getWidgetAttr } from "../../net/net_api";
import "./index.css";
// import Json from "bfj";

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
      {/*<div>*/}
      {/*  <select*/}
      {/*    defaultValue={navigator.language}*/}
      {/*    className="excalidraw_top-right_select"*/}
      {/*    onChange={(e) => {*/}
      {/*      onLanguage(e.target.value);*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    {*/}
      {/*      languages.map(item => {*/}
      {/*        return (*/}
      {/*          <option key={item.code} value={item.code}>{item.label}</option>*/}
      {/*        );*/}
      {/*      })*/}
      {/*    }*/}
      {/*  </select>*/}
      {/*  <button className="excalidraw_top-right_button" onClick={() => window.open("https://excalidraw.com/", "_blank")}>*/}
      {/*    excalidraw*/}
      {/*  </button>*/}
      {/*</div>*/}
      <div className="excalidraw_top-right_function">
        {/*<div title="视图模式" onClick={() => { setView() }}>*/}
        {/*  {*/}
        {/*    view ? <Icon type="eye" size="18" /> : <Icon type="eye-outline" size="18" />*/}
        {/*  }*/}
        {/*</div>*/}
        {/*<div title="主题" onClick={() => { setTheme() }}>*/}
        {/*  {*/}
        {/*    theme === 'light' ? <Icon type="contrast-outline" size="18" />*/}
        {/*      : <Icon type="contrast" size="18" />*/}
        {/*  }*/}
        {/*</div>*/}
        {/*/!* <div onClick={() => {setZen()}}>*/}
        {/*  <Icon type="code-outline" size="18" />*/}
        {/*</div> *!/*/}
        {/*<div title="网格模式" onClick={() => { setGrid() }}>*/}
        {/*  {*/}
        {/*    grid ? <Icon type="grid" size="18" /> : <Icon type="grid-outline" size="18" />*/}
        {/*  }*/}
        {/*</div>*/}
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
  useEffect(() => {
    console.log('author: zuoez02 & github:https://github.com/zuoez02 ');
  }, []);
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
      // console.log("Search!!!!");
      currentWidgetId = search.split("=")[1];
    };
    const json = serializeAsJSON(excalidrawRef.current.getSceneElements(), excalidrawRef.current.getAppState(), excalidrawRef.current.getFiles(), 'local');
    // console.log(` Json is ${json}`);

    try {
      // const temp = JSON.stringify(json);
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
    function StringtoJson(excalidrawData) {
      return new Promise((resolve)=>{
          resolve(JSON.parse(excalidrawData))
      });
    };
    async function getExcalidrawFile() {
      // 获取挂件的custom-excalidraw属性
      let block_data;
      if (currentWidgetId===undefined){
        const search = window.location.search;
        // console.log("Search!!!!")
        currentWidgetId = search.split("=")[1];
      }
      block_data = await getWidgetAttr(currentWidgetId);

      const excalidrawData = block_data['custom-excalidraw-data'];
      // console.log(`Block data ${excalidrawData}`);

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
          // onLibraryChange={() => {console.log('hello woeld')}}
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
