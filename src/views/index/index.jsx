import React, { useEffect, useState, useRef, useMemo } from "react";
import { getCurrentWidgetId } from '../../common/utils';
import Excalidraw, {
  // exportToCanvas,
  // exportToSvg,
  // exportToBlob,
  languages,
  serializeAsJSON,
} from "@excalidraw/excalidraw";
// import { serializeAsJSON } from '@excalidraw/excalidraw';
import { Icon } from 'react-kui';
import initialData from "../../common/initialData";
import { uploadFile, downloadFile, setWidgetAttr, getWidgetAttr } from "../../net/net_api";
import "./index.css";

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
      <div>
        <select
          defaultValue={navigator.language}
          className="excalidraw_top-right_select"
          onChange={(e) => {
            onLanguage(e.target.value);
          }}
        >
          {
            languages.map(item => {
              return (
                <option key={item.code} value={item.code}>{item.label}</option>
              );
            })
          }
        </select>
        <button className="excalidraw_top-right_button" onClick={() => window.open("https://excalidraw.com/", "_blank")}>
          excalidraw
        </button>
      </div>
      <div className="excalidraw_top-right_function">
        <div title="视图模式" onClick={() => { setView() }}>
          {
            view ? <Icon type="eye" size="18" /> : <Icon type="eye-outline" size="18" />
          }
        </div>
        <div title="主题" onClick={() => { setTheme() }}>
          {
            theme === 'light' ? <Icon type="contrast-outline" size="18" />
              : <Icon type="contrast" size="18" />
          }
        </div>
        {/* <div onClick={() => {setZen()}}>
          <Icon type="code-outline" size="18" />
        </div> */}
        <div title="网格模式" onClick={() => { setGrid() }}>
          {
            grid ? <Icon type="grid" size="18" /> : <Icon type="grid-outline" size="18" />
          }
        </div>
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
    console.log('感谢的Excalidraw和React KUI的支持！');
    console.log('author: bearxz & github:https://github.com/bearxz! ');
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
  const [lang, setLang] = useState(navigator.language);

  // 获取挂件块ID
  const currentWidgetId = useMemo(() => getCurrentWidgetId(), []);

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
      el.requestFullscreen && el.requestFullscreen();
    } else {
      document.exitFullscreen && document.exitFullscreen();
    }
    setisFullScreen(!isFullScreen);
  }

  async function saveExcalidrawFile() {
    const fileBlob = new Blob([serializeAsJSON(excalidrawRef.current.getSceneElements(), excalidrawRef.current.getAppState())], {
      type: 'application/json'
    });
    const fileName = currentWidgetId + '.excalidraw';
    const file = new File([fileBlob], fileName);
    const res = await uploadFile(file);
    const fileMap = res.succMap[fileName];
    // 获取返回后的地址，保存在挂件块的custom-excalidraw属性上
    setWidgetAttr(currentWidgetId, {
      "custom-excalidraw": fileMap,
      "data-assets": fileMap,
    });
    excalidrawRef.current.setToastMessage('保存成功');
  }

  useEffect(() => {
    async function getExcalidrawFile() {
      // 获取挂件的custom-excalidraw属性
      const data = await getWidgetAttr(currentWidgetId);
      const excalidrawFileName = data['custom-excalidraw'];
      if (excalidrawFileName) {
        console.log(excalidrawFileName)
        downloadFile(excalidrawFileName).then(res => {
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
